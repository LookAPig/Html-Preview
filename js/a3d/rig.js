/* ==== a3d/rig.js · one camera path for the whole story: map (2D) → dive → ride (3D) → rise (2D) ==== */
import * as THREE from '../vendor/three.module.min.js';
import { cl, seg, io, lerp, mobile } from './kit.js';

export const T = { dive: [2.45, 3.55], ride: [3.55, 8.2], rise: [8.2, 8.9] };

const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();

export function makeRig(map, road, marks) {
  const K = [0].concat(marks.stops, [marks.stops[marks.stops.length - 1] + 34]);
  const focus = new THREE.Vector3(2, 0, 4);
  const out = { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 30, roll: 0, offX: 0, offY: 0, dist: 0, bob: 0, cockpit: 0, near: 300, far: 600, spread: 80 };

  /* constant flow with a gentle slow-down at each board: speed never drops below ~40% */
  const END = K[K.length - 1], A = 0.6;
  function distAt(u) {
    const lin = cl(u) * END;
    let i = 0;
    while (i < K.length - 2 && lin > K[i + 1]) i++;
    const len = K[i + 1] - K[i], f = (lin - K[i]) / len;
    return K[i] + (f - A * Math.sin(2 * Math.PI * f) / (2 * Math.PI)) * len;
  }

  function mapPose(region, aspect) {
    const m = mobile.matches;
    focus.lerp(region < 0 ? v3.set(2, 0, 4) : v3.copy(map.centers[region]).lerp(v1.set(2, 0, 4), m ? 0.15 : 0.7), 0.06);
    const half = Math.tan(THREE.MathUtils.degToRad(15));
      const need = m ? 66 : 132, frac = m ? 1 : 0.56;
    const D = need / (2 * half * aspect * frac);
    const pitch = THREE.MathUtils.degToRad(64);
    return {
      pos: v1.set(focus.x, Math.sin(pitch) * D, focus.z + Math.cos(pitch) * D).clone(),
      target: focus.clone(),
      offX: m ? 0 : -0.17, offY: m ? -0.06 : 0.02
    };
  }

  function ridePose(d, t) {
    const f = road.at(d), a = road.at(d + 9), b = road.at(d + 5);
    const pos = f.p.clone();
    const target = a.p.clone().setY(1.2);
    let best = null, bw = 0;
    marks.marks.forEach(function (mk) {
      const w = io(cl(1 - Math.abs(d + 1 - mk.s) / 11));
      if (w > bw) { bw = w; best = mk; }
    });
    if (best) target.lerp(best.look, bw * (mobile.matches ? 0.72 : 0.42));
    const turn = f.t.x * b.t.z - f.t.z * b.t.x;
    const roll = Math.max(-0.06, Math.min(0.06, turn * 0.5));
    return { pos: pos, target: target, roll: roll + Math.sin(t * 0.9) * 0.003 };
  }

  let prev = 0, speed = 0, lastT = 0;
  function update(p, t, region, aspect) {
    const m = mobile.matches, rideFov = m ? 72 : 62;
    const e = io(seg(p, T.dive[0], T.dive[1]));
    const u = seg(p, T.ride[0], T.ride[1]);
    const r = io(seg(p, T.rise[0], T.rise[1]));
    const d = distAt(u);
    const dt = Math.max(0.001, t - lastT);
    speed = lerp(speed, Math.abs(d - prev) / dt, 0.08);
    prev = d; lastT = t;
    const moving = cl(speed / 6);
    out.bob = Math.sin(d * 1.7) * 0.006 * moving;
    out.dist = d;
    out.kmh = Math.min(42, speed * 2.2);

    const mp = mapPose(region, aspect);
    const rp = ridePose(d, t);
    rp.pos.y = 1.55 + Math.sin(d * 1.7) * 0.03 * moving;

    if (e < 1) {
      const c = v2.set(map.hq.x, 22, map.hq.z + 30);
      const a = 1 - e;
      out.pos.set(0, 0, 0).addScaledVector(mp.pos, a * a).addScaledVector(c, 2 * a * e).addScaledVector(rp.pos, e * e);
      out.target.copy(mp.target).lerp(rp.target, io(cl(e * 1.15)));
      out.fov = lerp(30, rideFov, Math.pow(e, 1.6));
      out.roll = rp.roll * e;
      out.offX = mp.offX * (1 - e); out.offY = mp.offY * (1 - e);
    } else {
      out.pos.copy(rp.pos);
      out.target.copy(rp.target);
      out.fov = rideFov;
      out.roll = rp.roll;
      out.offX = out.offY = 0;
    }
    if (r > 0) {
      const fw = road.at(d + 6).p;
      out.pos.y += r * 34; out.pos.z += r * 12;
      out.target.lerp(fw, r);
      out.fov = lerp(out.fov, 40, r);
      out.roll *= 1 - r;
    }

    out.cockpit = cl((e - 0.82) / 0.18) * (1 - cl(r * 3));
    out.near = lerp(lerp(320, 30, e), 120, r);
    out.far = lerp(lerp(640, 160, e), 260, r);
    out.spread = lerp(lerp(85, 34, e), 60, r);
    out.u = u;
    return out;
  }

  return { update: update, K: K };
}
