/* ==== a3d/rig.js · one camera through banner → map → dive → ride → third person → craft ==== */
import * as THREE from '../vendor/three.module.min.js';
import { T, seg, io, eo, lerp, CITY } from './kit.js';
import { pose, mix, place, toLocal, heroCover, heroBack, mapPose, riderPose, TECH, HOT } from './poses.js';
import { LANE } from './street.js';

const R0 = T.regions[0], RS = T.regions[1];
export const RIDE = [T.ride[0], T.ride[1] + 0.4];
function ll(a, b, k) { return Math.exp(lerp(Math.log(a), Math.log(b), k)); }

export function makeRig(o) {
  const P = o.P, N = o.regions.length;
  const out = {
    pos: new THREE.Vector3(), target: new THREE.Vector3(), shadow: new THREE.Vector3(), bike: new THREE.Vector3(),
    hot: new THREE.Vector3(), anchor: new THREE.Vector3(), aw: [], act: [], fov: 30, offY: 0
  };
  const tmp = { t: new THREE.Vector3() }, tmp2 = { t: new THREE.Vector3() }, v = new THREE.Vector3();

  function regions(p) {
    for (let r = 0; r < N; r++) {
      const a = R0 + r * RS;
      out.aw[r] = io(seg(p, a, a + 0.35));
      const end = r < N - 1 ? R0 + (r + 1) * RS : T.map[1] - 0.3;
      out.act[r] = out.aw[r] * (1 - io(seg(p, end, end + 0.3)));
    }
    const k = Math.floor((p - R0) / RS);
    out.region = p >= R0 + 0.1 && k < N ? k : -1;
    if (out.region >= 0) {
      const a = R0 + k * RS;
      out.regionW = io(seg(p, a + 0.1, a + 0.25)) * (1 - io(seg(p, a + RS - 0.08, a + RS)));
    } else out.regionW = 0;
  }

  /* mobile: the camera pans to each region as it lights up */
  function mapX(p, small, half) {
    if (!small) return 0;
    const xs = [0].concat(o.regions.map(function (r) { return r.center.x; }), [0]);
    const ts = [T.map[0]].concat(o.regions.map(function (_, r) { return R0 + r * RS; }), [T.map[1] - 0.3]);
    let x = 0;
    for (let i = 1; i < xs.length; i++) x = lerp(i === 1 ? xs[0] : x, xs[i], io(seg(p, ts[i] - 0.15, ts[i] + 0.2)));
    const lim = Math.max(0, 60 - half);
    return Math.max(-lim, Math.min(lim, x));
  }

  function ride(p) {
    const u = seg(p, RIDE[0], RIDE[1]);
    const s = o.END * (u - Math.sin(2 * Math.PI * u) / (2 * Math.PI));
    out.dist = s;
    out.kmh = 27 * (1 - Math.cos(2 * Math.PI * u)) / 2;
    out.bike.set(o.xs - s, 0.02, P.z + LANE);
    let act = 0;
    o.panels.forEach(function (pn, i) { if (s >= pn.s - 16) act = i; });
    out.active = act;
    out.u = s / o.panels[o.panels.length - 1].s;
    let yaw = 0, best = 0;
    o.panels.forEach(function (pn) {
      const ahead = pn.s - s, w = io(seg(ahead, 21, 11)) * (1 - io(seg(ahead, 7, 2)));
      if (w > best) { best = w; yaw = Math.atan2(pn.side * 6.4 - LANE, Math.max(ahead, 2)) * 57.3 * w * 0.5; }
    });
    const bob = Math.sin(s * 2.1) * 0.012 * (out.kmh / 27);
    v.set(out.bike.x + 0.3, out.bike.y + 1.5 + bob, out.bike.z);
    out.roll = Math.sin(s * 0.7) * 0.006 * (out.kmh / 27);
    return riderPose(v, 12.5 + Math.sin(s * 0.33) * 0.6, yaw);
  }

  function bikeAt(l, target) { return target.set(out.bike.x - l[2], out.bike.y + l[1], out.bike.z + l[0]); }

  function update(p, aspect, frac, small) {
    const fovRide = small ? 76 : 62, mapOff = small ? 0.02 : 0.08;
    const th = Math.tan(15 * Math.PI / 180) * aspect;
    regions(p);
    out.S = 1; out.dive = 0; out.roll = 0; out.offY = 0; out.fov = 30; out.tech = -1; out.techW = 0;
    out.sink = io(seg(p, 0.95, 1.45));
    ride(Math.max(p, RIDE[0]));
    let ps, spread = 70, near = 0.5, far = 2400, fn = 900, ff = 2400;
    out.shadow.set(0, 0, 0);
    const map = mapPose(30, aspect, frac, small, 0);
    map.t.x = mapX(p, small, map.d * th);
    map.az = Math.sin(Math.PI * seg(p, T.map[0], T.map[1])) * 0.05;
    if (p < T.map[0]) {
      const cover = heroCover(o.hero, 30, aspect), back = heroBack(o.hero, 30, aspect);
      if (p < 0.85) ps = mix(cover, back, io(seg(p, 0.06, 0.85)), undefined, tmp);
      else {
        const k = io(seg(p, 0.85, T.map[0]));
        ps = mix(back, map, k, eo(seg(p, 0.95, T.map[0])), tmp);
        out.offY = mapOff * k;
      }
      spread = lerp(36, 70, seg(p, 0.85, T.map[0]));
      out.shadow.copy(o.hero.center).multiplyScalar(1 - seg(p, 0.85, T.map[0]));
    } else if (p < T.dive[0]) {
      ps = map;
      out.offY = mapOff;
    } else if (p < T.dive[1]) {
      const k = seg(p, T.dive[0], T.dive[1]);
      const b = toLocal(ride(RIDE[0]), P);
      ps = tmp;
      ps.t.lerpVectors(map.t, b.t, eo(seg(k, 0, 0.72)));
      ps.d = ll(map.d, b.d, io(k));
      ps.el = lerp(map.el, b.el, io(seg(k, 0.5, 1)));
      ps.az = lerp(0, b.az, io(seg(k, 0.05, 0.6)));
      out.S = Math.pow(CITY, k); out.dive = k;
      out.offY = mapOff * (1 - io(seg(k, 0, 0.4)));
      out.fov = lerp(30, fovRide, io(seg(k, 0.45, 1)));
      const L = 1 / CITY;
      near = ll(0.5, 0.05 * L, k); far = ll(2400, 900 * L, k); fn = ll(900, 50 * L, k); ff = ll(2400, 430 * L, k);
      spread = ll(70, 55 * L, k);
      out.shadow.copy(ps.t);
      ride(Math.max(p, RIDE[0]));
    } else {
      out.S = CITY; out.dive = 1;
      near = 0.05; far = 900; fn = 50; ff = 430;
      const fp = ride(p);
      ps = fp;
      out.fov = fovRide;
      spread = 55;
      out.shadow.copy(out.bike).x -= 26;
      if (p > 10.9) {
        bikeAt([0, 0.75, 0], v);
        const zoom = small ? 2.1 : 1;
        const chase = pose(v, 4.4 * zoom, 13, 132);
        const k = io(seg(p, 10.9, 11.5));
        out.offY = small ? -0.13 * k : 0;
        ps = mix(fp, chase, k, undefined, tmp);
        out.fov = lerp(fovRide, 42, k);
        out.roll *= 1 - k;
        spread = ll(55, 7, k);
        out.shadow.lerp(out.bike, k);
        if (p > 11.5) {
          const views = TECH.map(function (tv) { return pose(bikeAt(tv.look, new THREE.Vector3()), tv.d * zoom, tv.el, tv.az); });
          ps = mix(chase, views[0], io(seg(p, 11.5, 12.0)), undefined, tmp2);
          for (let i = 1; i < views.length; i++) {
            const a = T.tech[0] + i * T.tech[1];
            ps = mix(ps, views[i], io(seg(p, a - 0.12, a + 0.28)), undefined, i % 2 ? tmp : tmp2);
          }
          ps.az += seg(p, T.out[0] - 0.2, T.out[1]) * 0.25;
          out.fov = lerp(42, 36, seg(p, 11.5, 12));
          const ti = Math.floor((p - T.tech[0]) / T.tech[1]);
          if (ti >= 0 && ti < TECH.length) {
            const a = T.tech[0] + ti * T.tech[1];
            out.tech = ti;
            out.techW = io(seg(p, a + 0.12, a + 0.26)) * (1 - io(seg(p, a + T.tech[1] - 0.1, a + T.tech[1])));
            bikeAt(HOT[ti], out.hot);
          }
        }
      }
    }
    place(ps, out.pos);
    out.target.copy(ps.t);
    if (out.S !== 1 && out.S !== CITY) {
      out.pos.sub(P).multiplyScalar(out.S).add(P);
      out.target.sub(P).multiplyScalar(out.S).add(P);
      out.shadow.sub(P).multiplyScalar(out.S).add(P);
    }
    const sc = out.S === CITY || out.S === 1 ? 1 : out.S;
    out.near = near * sc; out.far = far * sc; out.fogNear = fn * sc; out.fogFar = ff * sc; out.spread = spread * sc;
    if (out.region >= 0) out.anchor.copy(o.regions[out.region].center).setY(2.4);
    return out;
  }
  return { update: update };
}
