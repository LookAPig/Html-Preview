/* ==== a3d/street.js · avenue between the towers, authored in final world metres ==== */
import * as THREE from '../vendor/three.module.min.js';
import { seg, ss, CITY } from './kit.js';
import { asphaltTex, paverTex } from './tex.js';

/* +dz is the rider's left (travel is -x); the rider holds the right-hand bike lane */
export const HALF = 4.6, LANE = -3.8, WALK = [4.85, 8.6];

export function worldGroup(root, P) {
  const wg = new THREE.Group();
  wg.scale.setScalar(1 / CITY);
  wg.position.copy(P).multiplyScalar(1 - 1 / CITY);
  root.add(wg);
  return wg;
}

export function buildStreet(wg, P, len) {
  const x0 = P.x + 40, x1 = P.x - len, L = x0 - x1, cx = (x0 + x1) / 2, zc = P.z;
  const g = new THREE.Group();
  wg.add(g);

  function strip(w, mat, y, dz) {
    const geo = new THREE.PlaneGeometry(L, w);
    geo.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(cx, y, zc + dz);
    m.receiveShadow = true;
    g.add(m);
    return m;
  }
  const asphalt = new THREE.MeshStandardMaterial({ map: asphaltTex(L / 4, HALF * 2 / 4), roughness: 0.92, metalness: 0 });
  strip(HALF * 2, asphalt, 0.02, 0);
  const lane = new THREE.MeshStandardMaterial({ color: 0xA9573C, roughness: 0.85, transparent: true, opacity: 0.88, polygonOffset: true, polygonOffsetFactor: -1 });
  strip(1.5, lane, 0.025, LANE);
  strip(1.5, lane, 0.025, -LANE);
  const line = new THREE.MeshStandardMaterial({ color: 0xE9E9E4, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 });
  [-3.0, 3.0, -4.45, 4.45].forEach(function (dz) { strip(0.12, line, 0.03, dz); });

  const dashGeo = new THREE.PlaneGeometry(3, 0.14);
  dashGeo.rotateX(-Math.PI / 2);
  const nDash = Math.floor(L / 9);
  const dashes = new THREE.InstancedMesh(dashGeo, line, nDash * 2);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < nDash; i++) {
    m4.makeTranslation(x0 - 4 - i * 9, 0.03, zc + 0.12); dashes.setMatrixAt(i * 2, m4);
    m4.makeTranslation(x0 - 4 - i * 9, 0.03, zc - 0.12); dashes.setMatrixAt(i * 2 + 1, m4);
  }
  dashes.receiveShadow = true;
  g.add(dashes);

  const curbMat = new THREE.MeshStandardMaterial({ color: 0xD9D5CE, roughness: 0.75 });
  const walkMat = new THREE.MeshStandardMaterial({ map: paverTex(L / 2.4, (WALK[1] - WALK[0]) / 2.4), roughness: 0.88 });
  [1, -1].forEach(function (side) {
    const curb = new THREE.Mesh(new THREE.BoxGeometry(L, 0.16, 0.26), curbMat);
    curb.position.set(cx, 0.08, zc + side * (HALF + 0.13));
    curb.castShadow = curb.receiveShadow = true;
    const walk = new THREE.Mesh(new THREE.BoxGeometry(L, 0.15, WALK[1] - WALK[0]), [curbMat, curbMat, walkMat, curbMat, curbMat, curbMat]);
    walk.position.set(cx, 0.075, zc + side * (WALK[0] + WALK[1]) / 2);
    walk.receiveShadow = true;
    g.add(curb, walk);
  });

  /* streetlights: pole, arm reaching over the road, LED head */
  const steel = new THREE.MeshStandardMaterial({ color: 0x3B3E42, roughness: 0.38, metalness: 0.75 });
  const poleGeo = new THREE.CylinderGeometry(0.06, 0.09, 7, 10);
  poleGeo.translate(0, 3.5, 0);
  const armGeo = new THREE.BoxGeometry(0.08, 0.08, 2.2);
  armGeo.translate(0, 6.9, -1.1);
  const headGeo = new THREE.BoxGeometry(0.34, 0.1, 0.8);
  headGeo.translate(0, 6.84, -2.2);
  const lampMat = new THREE.MeshStandardMaterial({ color: 0xF2F2F2, emissive: 0xFFF4E2, emissiveIntensity: 0.6, roughness: 0.3 });
  const nLamp = Math.floor(L / 26);
  const poles = new THREE.InstancedMesh(poleGeo, steel, nLamp * 2);
  const arms = new THREE.InstancedMesh(armGeo, steel, nLamp * 2);
  const heads = new THREE.InstancedMesh(headGeo, lampMat, nLamp * 2);
  const base = [];
  const q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < nLamp; i++) {
    [1, -1].forEach(function (side, k) {
      base.push({ x: x0 - 8 - i * 26 - k * 13, z: zc + side * (HALF + 0.55), turn: side > 0 ? 0 : Math.PI });
    });
  }
  [poles, arms, heads].forEach(function (im) { im.castShadow = true; im.frustumCulled = false; g.add(im); });

  const v = new THREE.Vector3(), s = new THREE.Vector3();
  let grown = -1;
  function lamps(k) {
    if (k === grown) return;
    grown = k;
    base.forEach(function (b, n) {
      q.setFromAxisAngle(up, b.turn);
      s.set(1, Math.max(0.0001, k), 1);
      m4.compose(v.set(b.x, 0, b.z), q, s);
      poles.setMatrixAt(n, m4); arms.setMatrixAt(n, m4); heads.setMatrixAt(n, m4);
    });
    poles.instanceMatrix.needsUpdate = arms.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true;
  }

  /* dive: the street appears as the road dots sink, lamps rise just after */
  function update(dive) {
    g.visible = dive > 0.12;
    if (g.visible) lamps(ss(seg(dive, 0.35, 0.75)));
  }
  update(0);
  return { update: update, textures: [asphalt.map, walkMat.map], x0: x0 };
}
