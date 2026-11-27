/* ==== a3d/wheel.js · 26 × 4 fat-tire wheel: knobby tire, alloy rim, laced spokes, hub motor, disc ==== */
import * as THREE from '../vendor/three.module.min.js';

export const WR = 0.34;
export const M = {
  rubber: new THREE.MeshStandardMaterial({ color: 0x1A1A1B, roughness: 0.92 }),
  alloy: new THREE.MeshStandardMaterial({ color: 0xBFC2C6, roughness: 0.28, metalness: 0.95 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x2A2B2E, roughness: 0.45, metalness: 0.7 }),
  disc: new THREE.MeshStandardMaterial({ color: 0xD4D6D9, roughness: 0.22, metalness: 1, side: THREE.DoubleSide }),
  volt: new THREE.MeshStandardMaterial({ color: 0xFE5416, roughness: 0.35, metalness: 0.2 })
};

function onX(geo) { geo.rotateZ(Math.PI / 2); return geo; }

export function buildWheel() {
  const g = new THREE.Group();
  const spin = new THREE.Group();
  g.add(spin);

  const tire = new THREE.Mesh(new THREE.TorusGeometry(WR - 0.058, 0.058, 18, 72), M.rubber);
  tire.rotation.y = Math.PI / 2;
  tire.scale.set(1, 1, 1.12);
  spin.add(tire);

  /* staggered tread knobs around the crown */
  const N = 56;
  const knobs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.018, 0.034), M.rubber, N * 2);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), s = new THREE.Vector3(1, 1, 1), ax = new THREE.Vector3(1, 0, 0);
  for (let i = 0; i < N * 2; i++) {
    const row = i % 2, a = (Math.floor(i / 2) + row * 0.5) / N * Math.PI * 2;
    const x = row ? 0.034 : -0.034, r = WR - 0.006 - Math.abs(x) * 0.25;
    q.setFromAxisAngle(ax, a);
    m4.compose(v.set(x, Math.cos(a) * r, Math.sin(a) * r), q, s);
    knobs.setMatrixAt(i, m4);
  }
  spin.add(knobs);

  const rim = new THREE.Mesh(onX(new THREE.CylinderGeometry(WR - 0.1, WR - 0.1, 0.085, 64, 1, true)), M.alloy);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(WR - 0.1, 0.012, 8, 64), M.dark);
  lip.rotation.y = Math.PI / 2;
  const lip2 = lip.clone();
  lip.position.x = 0.044; lip2.position.x = -0.044;
  spin.add(rim, lip, lip2);

  const hub = new THREE.Mesh(onX(new THREE.CylinderGeometry(0.085, 0.085, 0.11, 32)), M.dark);
  const cap = new THREE.Mesh(onX(new THREE.CylinderGeometry(0.03, 0.03, 0.13, 16)), M.volt);
  const disc = new THREE.Mesh(new THREE.RingGeometry(0.045, 0.1, 40), M.disc);
  disc.rotation.y = Math.PI / 2;
  disc.position.x = -0.075;
  spin.add(hub, cap, disc);

  /* 32 spokes, crossed, from hub flanges to the rim bed */
  const NS = 32;
  const spokeGeo = new THREE.CylinderGeometry(0.0028, 0.0028, 1, 4);
  const spokes = new THREE.InstancedMesh(spokeGeo, M.alloy, NS);
  const a0 = new THREE.Vector3(), b0 = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), d = new THREE.Vector3();
  for (let i = 0; i < NS; i++) {
    const side = i % 2 ? 1 : -1, ang = i / NS * Math.PI * 2, lead = (i % 4 < 2 ? 1 : -1) * 0.55;
    a0.set(side * 0.05, Math.cos(ang + lead) * 0.07, Math.sin(ang + lead) * 0.07);
    b0.set(side * 0.012, Math.cos(ang) * (WR - 0.11), Math.sin(ang) * (WR - 0.11));
    d.subVectors(b0, a0);
    const len = d.length();
    q.setFromUnitVectors(up, d.normalize());
    m4.compose(v.addVectors(a0, b0).multiplyScalar(0.5), q, s.set(1, len, 1));
    spokes.setMatrixAt(i, m4);
  }
  spin.add(spokes);

  g.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
  return { group: g, spin: spin };
}
