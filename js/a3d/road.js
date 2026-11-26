/* ==== a3d/road.js · the ride: asphalt, kerbs, dashes, lamps, soft hills ==== */
import * as THREE from '../vendor/three.module.min.js';
import { C, cl, eo, mobile } from './kit.js';

const SWAY = [0, 0, 4, -5, 3, -6, 5, -3, 6, -4, 3, -5, 2, 0, 0];

export function buildRoad(scene, start) {
  const group = new THREE.Group();
  scene.add(group);
  const pts = SWAY.map(function (x, i) { return new THREE.Vector3(start.x + x, 0, start.z - i * 26); });
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  curve.arcLengthDivisions = 2000;
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

  const roadMat = new THREE.MeshStandardMaterial({ color: 0x303030, roughness: 0.95 });
  const kerbMat = new THREE.MeshStandardMaterial({ color: 0xE6E6E6, roughness: 0.9 });
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const strips = [
    strip(1.8, -1.8, 0.02, roadMat, 900),
    strip(2.45, 1.8, 0.025, kerbMat, 900),
    strip(-1.8, -2.45, 0.025, kerbMat, 900),
    strip(1.6, 1.5, 0.03, lineMat, 900),
    strip(-1.5, -1.6, 0.03, lineMat, 900)
  ];

  const o = new THREE.Object3D();
  function place(mesh, list) {
    list.forEach(function (it, i) {
      o.position.copy(it.p); o.rotation.set(0, it.ry || 0, 0); o.scale.setScalar(it.s || 1);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    group.add(mesh);
    return mesh;
  }

  const dashes = [];
  for (let s = 3; s < L; s += 2.6) {
    const f = at(s);
    dashes.push({ p: f.p.clone().setY(0.035), ry: Math.atan2(f.t.x, f.t.z) });
  }
  const dashMesh = place(new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.01, 1.1), new THREE.MeshBasicMaterial({ color: C.volt }), dashes.length), dashes);

  const arm = new THREE.CurvePath();
  arm.add(new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3.1, 0)));
  arm.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 3.1, 0), new THREE.Vector3(0, 3.45, 0), new THREE.Vector3(0.45, 3.45, 0)));
  arm.add(new THREE.LineCurve3(new THREE.Vector3(0.45, 3.45, 0), new THREE.Vector3(0.9, 3.45, 0)));
  const poleGeo = new THREE.TubeGeometry(arm, 40, 0.045, 10);
  const headGeo = new THREE.CapsuleGeometry(0.06, 0.36, 4, 12);
  headGeo.rotateZ(Math.PI / 2);
  headGeo.translate(0.78, 3.4, 0);
  const lamps = [];
  for (let s = 17, k = 0; s < L; s += 22, k++) {
    const f = at(s), side = k % 2 ? 1 : -1;
    const p = f.p.clone().addScaledVector(f.n, side * 2.75);
    lamps.push({ p: p, ry: Math.atan2(f.n.z * side, -f.n.x * side) });
  }
  const poleMesh = place(new THREE.InstancedMesh(poleGeo, new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.35, metalness: 0.1 }), lamps.length), lamps);
  const headMesh = place(new THREE.InstancedMesh(headGeo, new THREE.MeshBasicMaterial({ color: C.volt }), lamps.length), lamps);
  poleMesh.castShadow = true;
  const counted = [[dashMesh, dashes.length], [poleMesh, lamps.length], [headMesh, lamps.length]];

  /* grow: the road paints forward from HQ while the kit rises out of the floor */
  function update(grow) {
    group.visible = grow > 0;
    if (!group.visible) return;
    const g = eo(grow);
    strips.forEach(function (m) { m.geometry.setDrawRange(0, Math.floor(m.userData.n * g / 6) * 6); });
    counted.forEach(function (c) { c[0].count = Math.floor(c[1] * g); });
  }

  const roadX = [];
  for (let i = 0; i <= 600; i++) { const f = at(L * i / 600); roadX.push([f.p.z, f.p.x]); }

  return { group: group, curve: curve, L: L, at: at, update: update, roadX: roadX, mobile: mobile.matches };
}
