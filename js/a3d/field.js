/* ==== a3d/field.js · dot-matrix landscape beside the road (same grid + pillars as the map) ==== */
import * as THREE from '../vendor/three.module.min.js';
import { cl, eo, rand, mobile } from './kit.js';

function noise(x, z) {
  const s = Math.sin(x * 0.17 + Math.sin(z * 0.11) * 1.7) + Math.sin(z * 0.13 + Math.cos(x * 0.09) * 2.1) + Math.sin((x + z) * 0.05);
  return s / 3 * 0.5 + 0.5;
}

export function buildField(scene, road, hubs) {
  const rnd = rand(5);
  const rx = road.roadX;
  function roadXAt(z) {
    for (let i = 1; i < rx.length; i++) {
      if (rx[i][0] <= z) { const a = rx[i - 1], b = rx[i], t = (z - a[0]) / (b[0] - a[0] || 1); return a[1] + (b[1] - a[1]) * t; }
    }
    return rx[rx.length - 1][1];
  }

  let cells = [];
  const cap = mobile.matches ? 1800 : 3600;
  const z0 = Math.floor(rx[0][0]) + 8, z1 = Math.floor(rx[rx.length - 1][0]);
  for (let z = z0; z > z1; z--) {
    const cx = roadXAt(z + 0.5);
    for (let x = Math.floor(cx - 38); x < cx + 38; x++) {
      const px = x + 0.5, pz = z + 0.5, lat = Math.abs(px - cx);
      if (lat < 5.5) continue;
      let hub = 0;
      for (let k = 0; k < hubs.length; k++) {
        const dx = px - hubs[k].x, dz = pz - hubs[k].z;
        hub = Math.max(hub, Math.exp(-(dx * dx + dz * dz) / 20));
      }
      const n = noise(px, pz);
      const keep = n > 0.6 - lat * 0.002 || hub > 0.25;
      if (!keep || rnd() < 0.18) continue;
      const far = 0.15 + 0.85 * cl((lat - 5.5) / 24);
      const h = 0.14 + (Math.pow(cl((n - 0.6) * 3), 1.4) * 2.6 * (0.6 + rnd() * 0.6) + hub * (1.2 + rnd() * 0.8)) * far;
      cells.push({ x: px, z: pz, h: h, hub: hub });
    }
  }
  if (cells.length > cap) {
    const keepP = cap / cells.length;
    cells = cells.filter(function (c) { return c.hub > 0.25 || rnd() < keepP; });
  }

  const geo = new THREE.CylinderGeometry(0.32, 0.32, 1, 16);
  geo.translate(0, 0.5, 0);
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.8 }), cells.length);
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  const o = new THREE.Object3D(), col = new THREE.Color(), white = new THREE.Color(0xFFFFFF), warm = new THREE.Color(0xFFB496);
  cells.forEach(function (c, i) {
    o.position.set(c.x, 0, c.z);
    o.scale.set(1, c.h, 1);
    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
    mesh.setColorAt(i, col.copy(white).lerp(warm, cl(c.hub * 1.2)));
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.instanceColor.needsUpdate = true;
  scene.add(mesh);

  let last = -1;
  function update(grow) {
    mesh.visible = grow > 0;
    const k = Math.max(0.001, eo(cl(grow * 1.6 - 0.6)));
    if (!mesh.visible || k === last) return;
    last = k;
    mesh.scale.y = k;
  }

  return { update: update };
}
