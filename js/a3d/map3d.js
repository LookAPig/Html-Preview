/* ==== a3d/map3d.js · clay dot-matrix world: raised land dots, hubs, arcs from HQ ==== */
import * as THREE from '../vendor/three.module.min.js';
import { C, cl, lerp } from './kit.js';

const OX = 60, OZ = 22;

export function grid(world, p) {
  return new THREE.Vector3((p.lon + 180) / world.step - OX, 0, (world.top - p.lat) / world.step + 0.5 - OZ);
}

function wave(d, k, max, span) { return cl((k * (max + span) - d) / span); }

export function buildMap(scene, data, world) {
  const group = new THREE.Group();
  scene.add(group);
  const hq = grid(world, data.hq);

  const land = [];
  world.rows.forEach(function (row, j) {
    for (let i = 0; i < row.length; i++) if (row[i] === 'x') land.push(new THREE.Vector3(i + 0.5 - OX, 0, j + 0.5 - OZ));
  });
  const geo = new THREE.CylinderGeometry(0.32, 0.32, 1, 16);
  geo.translate(0, 0.5, 0);
  const dots = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.85 }), land.length);
  dots.castShadow = dots.receiveShadow = true;
  group.add(dots);
  const dist = land.map(function (v) { return v.distanceTo(hq); });
  const maxD = Math.max.apply(null, dist);

  const hubs = [];
  const pillar = new THREE.CylinderGeometry(0.2, 0.2, 1, 12);
  pillar.translate(0, 0.5, 0);
  const ball = new THREE.SphereGeometry(0.42, 20, 14);
  const ringGeo = new THREE.RingGeometry(0.8, 1, 48);
  ringGeo.rotateX(-Math.PI / 2);
  const voltMat = new THREE.MeshStandardMaterial({ color: C.volt, emissive: C.volt, emissiveIntensity: 0.35, roughness: 0.4 });
  const inkMat = new THREE.MeshStandardMaterial({ color: C.ink, roughness: 0.5 });

  function hub(pos, r, big, isHq) {
    const g = new THREE.Group();
    g.position.copy(pos);
    const stem = new THREE.Mesh(pillar, isHq ? inkMat : voltMat);
    const top = new THREE.Mesh(ball, voltMat);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: C.volt, transparent: true, depthWrite: false }));
    stem.castShadow = top.castShadow = true;
    g.add(stem, top, ring);
    group.add(g);
    const h = { g: g, stem: stem, top: top, ring: ring, r: r, big: big, hq: isHq, H: isHq ? 4.2 : big ? 2.6 : 1.6, ph: Math.random() };
    hubs.push(h);
    return h;
  }

  const HQ = hub(hq, -1, true, true);
  const routes = [];
  const tags = [{ name: data.hq.name, pos: new THREE.Vector3(), w: 0, hq: true }];
  data.regions.forEach(function (rg, r) {
    rg.pins.forEach(function (p, k) {
      const h = hub(grid(world, p), r, !!p.big, false);
      const a = new THREE.Vector3(hq.x, HQ.H, hq.z), b = new THREE.Vector3(h.g.position.x, h.H, h.g.position.z);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.y += a.distanceTo(b) * 0.32 + 2;
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.07, 6), new THREE.MeshBasicMaterial({ color: C.volt, transparent: true, depthWrite: false }));
      const comet = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), new THREE.MeshBasicMaterial({ color: C.volt }));
      group.add(tube, comet);
      routes.push({ r: r, curve: curve, tube: tube, comet: comet, n: tube.geometry.index.count, ph: (r * 3 + k) * 0.29 });
      if (k === 0) tags.push({ name: rg.label, pos: b.clone().setY(h.H + 0.9), r: r, w: 0 });
    });
  });
  tags[0].pos.set(hq.x, HQ.H + 0.9, hq.z);

  const centers = data.regions.map(function (_, r) {
    const ps = hubs.filter(function (h) { return h.r === r; });
    const c = new THREE.Vector3();
    ps.forEach(function (h) { c.add(h.g.position); });
    return c.multiplyScalar(1 / ps.length);
  });

  const aw = data.regions.map(function () { return 0; });
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), col = new THREE.Color();
  const white = new THREE.Color(0xFFFFFF), warm = new THREE.Color(0xFFC2AA);
  const hot = hubs.filter(function (h) { return h.big && !h.hq; });
  const B = data.regions.map(function (_, r) {
    return land.map(function (v) {
      let b = 0;
      hot.forEach(function (h) {
        if (h.r !== r) return;
        const dx = v.x - h.g.position.x, dz = v.z - h.g.position.z;
        b += Math.exp(-(dx * dx + dz * dz) / 14);
      });
      return b;
    });
  });
  let sig = -1;

  /* rise: map builds up from HQ · sink: map melts into the ground before the ride · draw: arcs grow */
  function update(t, s) {
    group.visible = s.rise > 0 && s.sink < 1;
    if (!group.visible) { tags.forEach(function (tg) { tg.w = 0; }); return; }
    aw.forEach(function (v, r) {
      const goal = r === s.region ? 1 : 0;
      aw[r] = s.snap || Math.abs(goal - v) < 0.002 ? goal : lerp(v, goal, 0.07);
    });
    const now = s.rise * 7 + s.sink * 131 + aw[0] + aw[1] * 3 + aw[2] * 5 + aw[3] * 9;
    if (now !== sig) { sig = now; dotsAt(s); }
    hubsAt(t, s);
  }

  function dotsAt(s) {
    const R = aw.length;
    for (let n = 0; n < land.length; n++) {
      const v = land[n], d = dist[n];
      let boost = 0;
      for (let r = 0; r < R; r++) if (aw[r] > 0) boost += aw[r] * B[r][n];
      boost = Math.min(1, boost);
      const k = wave(d, s.rise, maxD, 14) * (1 - wave(d, s.sink, maxD, 12));
      sc.set(1, Math.max(0.001, (0.22 + boost * 1.5) * k), 1);
      m4.compose(v, q, sc);
      dots.setMatrixAt(n, m4);
      dots.setColorAt(n, col.copy(white).lerp(warm, boost * 0.85));
    }
    dots.instanceMatrix.needsUpdate = true;
    dots.instanceColor.needsUpdate = true;
  }

  function hubsAt(t, s) {
    hubs.forEach(function (h) {
      const d = h.g.position.distanceTo(hq);
      const k = wave(d, s.rise, maxD, 14) * (1 - wave(d, s.sink, maxD, 12));
      const w = h.hq ? 1 : 0.35 + 0.65 * aw[h.r];
      const H = Math.max(0.001, h.H * k * w);
      h.stem.scale.y = H;
      h.top.position.y = H;
      h.top.scale.setScalar(Math.max(0.001, k * (h.hq ? 1.15 : h.big ? 0.9 : 0.6)));
      const p = (t / 2.2 + h.ph) % 1, on = h.hq ? 0.6 : aw[h.r];
      h.ring.scale.setScalar(0.4 + p * (h.big ? 3.2 : 2));
      h.ring.material.opacity = (1 - p) * 0.55 * on * k;
    });

    routes.forEach(function (rt) {
      const w = aw[rt.r];
      rt.tube.geometry.setDrawRange(0, Math.floor(rt.n * s.draw / 3) * 3);
      const fade = 1 - cl(s.sink * 2.5);
      rt.tube.visible = rt.comet.visible = fade > 0;
      rt.tube.material.opacity = (0.16 + 0.7 * w) * fade;
      const u = (t / 2.8 + rt.ph) % 1;
      rt.comet.position.copy(rt.curve.getPoint(u));
      rt.comet.scale.setScalar(Math.max(0.001, w * Math.sin(u * Math.PI) * s.draw * fade));
    });

    tags.forEach(function (tg) { tg.w = (tg.hq ? 1 : aw[tg.r]) * cl(s.draw * 2 - 1) * (1 - cl(s.sink * 4)); });
  }

  return { update: update, hq: hq, centers: centers, tags: tags };
}
