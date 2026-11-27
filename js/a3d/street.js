/* ==== a3d/street.js · avenue between the towers, authored in final world metres ==== */
import * as THREE from '../vendor/three.module.min.js';
import { CITY } from './kit.js';
import { asphaltTex, paverTex } from './tex.js';

/* the rider holds the central bike lane, so panels on both kerbs sit at the same distance */
export const HALF = 4.6, LANE = 0, WALK = [4.85, 8.6];

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
  strip(HALF * 2, asphalt, 0.04, 0);
  const lane = new THREE.MeshStandardMaterial({ color: 0xA45A40, roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  strip(2, lane, 0.04, LANE);
  const line = new THREE.MeshStandardMaterial({ color: 0xE9E9E4, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
  [LANE - 1.06, LANE + 1.06, -4.4, 4.4].forEach(function (dz) { strip(0.12, line, 0.04, dz); });

  const curbMat = new THREE.MeshStandardMaterial({ color: 0xD9D5CE, roughness: 0.75 });
  const walkMat = new THREE.MeshStandardMaterial({ map: paverTex(L / 2.4, (WALK[1] - WALK[0]) / 2.4), roughness: 0.88 });
  [1, -1].forEach(function (side) {
    const curb = new THREE.Mesh(new THREE.BoxGeometry(L, 0.18, 0.26), curbMat);
    curb.position.set(cx, 0.09, zc + side * (HALF + 0.13));
    curb.castShadow = curb.receiveShadow = true;
    const walk = new THREE.Mesh(new THREE.BoxGeometry(L, 0.16, WALK[1] - WALK[0]), [curbMat, curbMat, walkMat, curbMat, curbMat, curbMat]);
    walk.position.set(cx, 0.08, zc + side * (WALK[0] + WALK[1]) / 2);
    walk.receiveShadow = true;
    g.add(curb, walk);
  });

  /* dive: the street appears as the road dots sink */
  function update(dive) { g.visible = dive > 0.12; }
  update(0);
  return { update: update, textures: [asphalt.map, walkMat.map], x0: x0 };
}
