/* ==== a3d/hubs.js · HQ + regional pins, arcs from HQ, comets; lit one region at a time ==== */
import * as THREE from '../vendor/three.module.min.js';
import { C, cl, eo, OX, OZ } from './kit.js';

export function grid(world, p) {
  return new THREE.Vector3((p.lon + 180) / world.step - OX, 0, (world.top - p.lat) / world.step + 0.5 - OZ);
}

export function mapRegions(world, data) {
  return data.regions.map(function (rg) {
    const pts = rg.pins.map(function (p) { const v = grid(world, p); v.big = !!p.big; v.name = p.name; return v; });
    const c = new THREE.Vector3();
    pts.forEach(function (p) { c.add(p); });
    c.multiplyScalar(1 / pts.length);
    return { pts: pts, center: c };
  });
}

export function buildHubs(root, regions, hq) {
  const group = new THREE.Group();
  root.add(group);
  const stemGeo = new THREE.CylinderGeometry(0.09, 0.09, 1, 10);
  stemGeo.translate(0, 0.5, 0);
  const ballGeo = new THREE.SphereGeometry(0.34, 20, 14);
  const ringGeo = new THREE.RingGeometry(0.82, 1, 48);
  ringGeo.rotateX(-Math.PI / 2);
  const volt = new THREE.MeshStandardMaterial({ color: C.volt, emissive: C.volt, emissiveIntensity: 0.45, roughness: 0.35 });
  const ink = new THREE.MeshStandardMaterial({ color: C.ink, roughness: 0.4, metalness: 0.3 });

  function pin(pos, H, isHq) {
    const g = new THREE.Group();
    g.position.copy(pos);
    const stem = new THREE.Mesh(stemGeo, isHq ? ink : volt);
    const top = new THREE.Mesh(ballGeo, volt);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: C.volt, transparent: true, depthWrite: false, toneMapped: false }));
    ring.position.y = 0.25;
    stem.castShadow = top.castShadow = true;
    g.add(stem, top, ring);
    group.add(g);
    return { g: g, stem: stem, top: top, ring: ring, H: H, ph: Math.random() };
  }

  const HQ = pin(hq, 4.2, true);
  const pins = [], arcs = [];
  regions.forEach(function (rg, r) {
    rg.pts.forEach(function (p, k) {
      const h = pin(p, p.big ? 2.4 : 1.5, false);
      h.r = r; h.big = p.big;
      pins.push(h);
      const a = new THREE.Vector3(hq.x, HQ.H, hq.z), b = new THREE.Vector3(p.x, h.H, p.z);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.y += a.distanceTo(b) * 0.3 + 2;
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 72, 0.06, 6), new THREE.MeshBasicMaterial({ color: C.volt, transparent: true, depthWrite: false, toneMapped: false }));
      const comet = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, toneMapped: false }));
      group.add(tube, comet);
      arcs.push({ r: r, curve: curve, tube: tube, comet: comet, n: tube.geometry.index.count, ph: k * 0.31 });
    });
  });

  /* label anchors in map-local units; HUD projects them through root.matrixWorld */
  const tags = [{ name: 'Shenzhen HQ', pos: new THREE.Vector3(hq.x, HQ.H + 0.8, hq.z), r: -1, w: 0 }];
  pins.forEach(function (h) { tags.push({ name: '', pos: h.g.position.clone().setY(h.H + 0.7), r: h.r, w: 0, big: h.big }); });
  let n = 1;
  regions.forEach(function (rg) { rg.pts.forEach(function (p) { tags[n++].name = p.name; }); });

  /* st: { aw, act, show (map in), fade (dive out) } */
  function update(t, st) {
    const vis = st.show * st.fade;
    group.visible = vis > 0.001;
    if (!group.visible) { tags.forEach(function (tg) { tg.w = 0; }); return; }
    const hk = eo(st.show);
    HQ.stem.scale.y = HQ.H * hk;
    HQ.top.position.y = HQ.H * hk;
    HQ.top.scale.setScalar(Math.max(0.001, 1.25 * hk));
    pulse(HQ, t, 0.7 * vis, 2.6);
    pins.forEach(function (h) {
      const k = eo(st.aw[h.r]) * st.fade;
      h.stem.scale.y = Math.max(0.001, h.H * k);
      h.top.position.y = h.H * k;
      h.top.scale.setScalar(Math.max(0.001, k * (h.big ? 1 : 0.7)));
      pulse(h, t, (0.25 + 0.75 * st.act[h.r]) * k, h.big ? 3 : 2);
    });
    arcs.forEach(function (a) {
      const k = st.aw[a.r];
      a.tube.geometry.setDrawRange(0, Math.floor(a.n * eo(k) / 3) * 3);
      a.tube.material.opacity = (0.22 + 0.6 * st.act[a.r]) * st.fade;
      a.tube.visible = k > 0.001;
      const u = (t / 2.6 + a.ph) % 1;
      a.comet.position.copy(a.curve.getPoint(u));
      a.comet.scale.setScalar(Math.max(0.001, st.act[a.r] * Math.sin(u * Math.PI) * st.fade));
    });
    tags[0].w = vis;
    for (let i = 1; i < tags.length; i++) tags[i].w = cl(st.aw[tags[i].r] * 1.6 - 0.6) * st.fade * (tags[i].big ? 1 : 0.8);
  }

  function pulse(h, t, on, size) {
    const p = (t / 2.2 + h.ph) % 1;
    h.ring.scale.setScalar(0.3 + p * size);
    h.ring.material.opacity = (1 - p) * 0.6 * on;
    h.ring.visible = on > 0.01;
  }

  return { update: update, tags: tags };
}
