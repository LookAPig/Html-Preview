/* ==== a3d/road.js · clay world for the ride: asphalt ribbon, dashes, lamps, trees ==== */
import * as THREE from '../vendor/three.module.min.js';
import { C, cl, eo, rand } from './kit.js';

const SWAY = [0, 0, 4, -5, 3, -6, 5, -3, 6, -4, 3, -5, 2, 0, 0];

export function buildRoad(scene, start) {
  const group = new THREE.Group();
  scene.add(group);
  const pts = SWAY.map(function (x, i) { return new THREE.Vector3(start.x + x, 0, start.z - i * 26); });
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const L = curve.getLength();
  const tmpT = new THREE.Vector3();

  function at(s) {
    const u = cl(s / L);
    const p = curve.getPointAt(u), t = curve.getTangentAt(u, tmpT).clone();
    return { p: p, t: t, n: new THREE.Vector3(-t.z, 0, t.x).normalize() };
  }

  function strip(a, b, y, mat, N) {
    const pos = [], idx = [];
    for (let i = 0; i <= N; i++) {
      const f = at(L * i / N);
      pos.push(f.p.x + f.n.x * a, y, f.p.z + f.n.z * a, f.p.x + f.n.x * b, y, f.p.z + f.n.z * b);
      if (i < N) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat);
    m.receiveShadow = true;
    m.userData.n = idx.length;
    group.add(m);
    return m;
  }

  const roadMat = new THREE.MeshStandardMaterial({ color: C.road, roughness: 0.92 });
  const lineMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.6 });
  const strips = [
    strip(1.8, -1.8, 0.02, roadMat, 700),
    strip(1.55, 1.45, 0.03, lineMat, 700),
    strip(-1.45, -1.55, 0.03, lineMat, 700)
  ];

  const o = new THREE.Object3D();
  function place(mesh, list) {
    list.forEach(function (it, i) {
      o.position.copy(it.p); o.rotation.set(0, it.ry || 0, 0); o.scale.setScalar(it.s || 1);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    mesh.frustumCulled = false;
    group.add(mesh);
    return mesh;
  }

  const dashes = [];
  for (let s = 3; s < L; s += 2.6) {
    const f = at(s);
    dashes.push({ p: f.p.clone().setY(0.035), ry: Math.atan2(f.t.x, f.t.z) });
  }
  const dashGeo = new THREE.BoxGeometry(0.12, 0.01, 1.1);
  const dashMesh = place(new THREE.InstancedMesh(dashGeo, new THREE.MeshBasicMaterial({ color: C.volt }), dashes.length), dashes);
  dashMesh.castShadow = false;

  const lamps = [], heads = [];
  for (let s = 17, k = 0; s < L; s += 22, k++) {
    const f = at(s), side = k % 2 ? 1 : -1;
    const p = f.p.clone().addScaledVector(f.n, side * 2.7);
    lamps.push({ p: p });
    heads.push({ p: p.clone().setY(3.3).addScaledVector(f.n, -side * 0.35), ry: Math.atan2(f.n.x, f.n.z) });
  }
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.07, 3.4, 8);
  poleGeo.translate(0, 1.7, 0);
  const poleMesh = place(new THREE.InstancedMesh(poleGeo, new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5 }), lamps.length), lamps);
  const headMesh = place(new THREE.InstancedMesh(new THREE.BoxGeometry(0.14, 0.08, 0.7), new THREE.MeshStandardMaterial({ color: C.volt, emissive: C.volt, emissiveIntensity: 0.6 }), heads.length), heads);
  const counted = [[dashMesh, dashes.length], [poleMesh, lamps.length], [headMesh, heads.length]];

  const rnd = rand(7), trees = [], trunks = [];
  for (let i = 0; i < (matchMedia('(max-aspect-ratio: 999/1000)').matches ? 170 : 260); i++) {
    const s = -20 + rnd() * (L + 40), f = at(s), side = rnd() < 0.5 ? -1 : 1;
    const off = 6 + Math.pow(rnd(), 1.6) * 46, sc = 0.7 + rnd() * 1.1;
    const p = f.p.clone().addScaledVector(f.n, side * off);
    trees.push({ p: p.clone().setY(0.9 * sc), s: sc, ry: rnd() * 6 });
    trunks.push({ p: p, s: sc });
  }
  const cone = new THREE.ConeGeometry(0.9, 2.6, 7);
  cone.translate(0, 1.3, 0);
  const trunk = new THREE.CylinderGeometry(0.12, 0.16, 1, 6);
  trunk.translate(0, 0.5, 0);
  const treeMesh = place(new THREE.InstancedMesh(cone, new THREE.MeshStandardMaterial({ color: 0xF2F2F2, roughness: 0.9, flatShading: true }), trees.length), trees);
  const trunkMesh = place(new THREE.InstancedMesh(trunk, new THREE.MeshStandardMaterial({ color: 0xD8D8D8, roughness: 0.9 }), trunks.length), trunks);

  const hills = [];
  for (let i = 0; i < 14; i++) {
    const s = rnd() * L, f = at(s), side = i % 2 ? 1 : -1;
    hills.push({ p: f.p.clone().addScaledVector(f.n, side * (70 + rnd() * 60)).setY(-6), s: 14 + rnd() * 16 });
  }
  const hillMesh = place(new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshStandardMaterial({ color: 0xF0F0F0, roughness: 1, flatShading: true }), hills.length), hills);
  hillMesh.castShadow = false;
  hillMesh.scale.y = 0.5;

  const props = [treeMesh, trunkMesh];
  /* grow: road paints forward from HQ while the world rises out of the floor */
  function update(grow) {
    group.visible = grow > 0;
    if (!group.visible) return;
    strips.forEach(function (m) { m.geometry.setDrawRange(0, Math.floor(m.userData.n * eo(grow) / 6) * 6); });
    counted.forEach(function (c) { c[0].count = Math.floor(c[1] * eo(grow)); });
    const k = Math.max(0.001, eo(cl(grow * 1.4 - 0.4)));
    props.forEach(function (m) { m.scale.y = k; });
    hillMesh.scale.y = 0.5 * k;
  }

  return { group: group, curve: curve, L: L, at: at, update: update };
}
