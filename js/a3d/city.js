/* ==== a3d/city.js · square map dots that grow into towers around the street during the dive ==== */
import * as THREE from '../vendor/three.module.min.js';
import { cl, seg, ss, lerp, rand, OX, OZ } from './kit.js';
import { facadeMaterial } from './facade.js';

/* street runs along map row 18 (local z = -3.5), westward from HQ */
export const ROAD_ROW = 18, ROAD_Z = ROAD_ROW + 0.5 - OZ;
const TONES = [0xE8E5DF, 0xD9D5CD, 0xCBCFD4, 0xBCC1C7, 0xE1DCD2, 0xAFAAA2, 0xD3D7DB];
const DOT = 0.6, FOOT = 0.64, DOT_H = 0.34;

export function buildCity(root, world, regions, hq) {
  const R = rand(7);
  const cells = [];
  const hqCol = Math.floor(hq.x + OX);
  function add(i, j, land) {
    const x = i + 0.5 - OX, z = j + 0.5 - OZ;
    const road = j === ROAD_ROW && i <= hqCol + 3;
    const dx = x - hq.x, dz = z - ROAD_Z, d = Math.sqrt(dx * dx + dz * dz * 2.2);
    let H;
    if (road) H = 0;
    else if (d < 6) H = 2.6 + R() * 4.6;
    else if (d < 16) H = 1.8 + R() * 3.6;
    else if (d < 30) H = 0.9 + R() * 2.2;
    else H = 0.35 + R() * 1.1;
    if (Math.abs(j - ROAD_ROW) === 1 && !road && R() < 0.25) H *= 0.55;
    cells.push({ x: x, z: z, land: land, road: road, d: d, H: H, tone: new THREE.Color(TONES[Math.floor(R() * TONES.length)]) });
  }
  world.rows.forEach(function (row, j) {
    for (let i = 0; i < row.length; i++) {
      const land = row[i] === 'x';
      const near = j >= ROAD_ROW - 6 && j <= ROAD_ROW + 6 && i >= hqCol - 34 && i <= hqCol + 3;
      if (land || near) add(i, j, land);
    }
  });
  const hqTower = cells.filter(function (c) { return !c.road && Math.abs(c.x - (hqCol + 0.5 - OX)) < 0.1 && Math.abs(c.z - (ROAD_Z + 1)) < 0.1; })[0];
  if (hqTower) { hqTower.H = 8.2; hqTower.tone.set(0xE9E7E3); hqTower.hq = true; }

  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(0, 0.5, 0);
  const mat = facadeMaterial();
  const mesh = new THREE.InstancedMesh(geo, mat, cells.length);
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  root.add(mesh);

  /* region glow: each lit region warms and lifts the dots around its big pins */
  const B = regions.map(function (rg) {
    return cells.map(function (c) {
      let b = 0;
      rg.pts.forEach(function (p) {
        const dx = c.x - p.x, dz = c.z - p.z;
        b += Math.exp(-(dx * dx + dz * dz) / (p.big ? 10 : 4));
      });
      return c.land ? Math.min(1, b) : 0;
    });
  });

  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), s = new THREE.Vector3();
  const col = new THREE.Color(), white = new THREE.Color(0xD9D9D9), warm = new THREE.Color(0xFFAE8C), hot = new THREE.Color(0xFE6A35);
  let sig = '';

  /* st: { aw: region weights 0..1, act: highlight of the active region, dive: 0..1 } */
  function update(st) {
    const key = st.aw.map(function (a) { return a.toFixed(3); }).join() + st.act.map(function (a) { return a.toFixed(3); }).join() + st.dive.toFixed(4);
    if (key === sig) return;
    sig = key;
    const k = st.dive, toCity = ss(seg(k, 0.18, 0.62)), calm = 1 - seg(k, 0, 0.3);
    mat.userData.uFacade.value = ss(seg(k, 0.3, 0.72));
    for (let n = 0; n < cells.length; n++) {
      const c = cells[n];
      let boost = 0, heat = 0;
      for (let r = 0; r < B.length; r++) {
        const b = B[r][n];
        if (!b) continue;
        boost += st.aw[r] * b;
        heat += st.act[r] * b;
      }
      boost = Math.min(1, boost) * calm;
      heat = Math.min(1, heat) * calm;
      const dn = cl(c.d / 40);
      const g = ss(seg(k, 0.06 + dn * 0.3, 0.5 + dn * 0.3));
      let h, w;
      if (c.road) { h = c.land ? DOT_H * (1 - seg(k, 0.08, 0.35)) : 0; w = DOT; }
      else if (c.land) { h = lerp(DOT_H + boost * 0.9 + heat * 0.5, c.H, g); w = lerp(DOT, FOOT, g); }
      else { h = c.H * g; w = FOOT; }
      if (h < 0.002) s.set(0.0001, 0.0001, 0.0001);
      else s.set(w, h, w);
      m4.compose(v.set(c.x, 0, c.z), q, s);
      mesh.setMatrixAt(n, m4);
      col.copy(white).lerp(warm, boost * 0.75).lerp(hot, heat * 0.55).lerp(c.tone, toCity);
      mesh.setColorAt(n, col);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
  }

  return { mesh: mesh, update: update, hqTower: hqTower };
}
