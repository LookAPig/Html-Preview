/* ==== a3d/bike.js · dual-drive fat-tire e-bike, local +z forward, ground at y = 0 ==== */
import * as THREE from '../vendor/three.module.min.js';
import { canvasTex, rrect } from './kit.js';
import { buildWheel, WR, M } from './wheel.js';

const paint = new THREE.MeshPhysicalMaterial({ color: 0x1D1E21, roughness: 0.38, metalness: 0.5, clearcoat: 0.8, clearcoatRoughness: 0.18 });
const accent = new THREE.MeshPhysicalMaterial({ color: 0xFE5416, roughness: 0.32, metalness: 0.2, clearcoat: 0.6 });
const V = function (x, y, z) { return new THREE.Vector3(x, y, z); };

/* key frame points (x, y, z) */
export const PT = {
  bb: V(0, 0.3, -0.06), rear: V(0, WR, -0.6), front: V(0, WR, 0.6),
  seat: V(0, 0.86, -0.21), headTop: V(0, 0.97, 0.4), headLow: V(0, 0.72, 0.46)
};

const capGeo = new THREE.SphereGeometry(1, 14, 10);
function tube(g, pts, r, mat, x) {
  const ps = pts.map(function (p) { return p.clone().setX(p.x + (x || 0)); });
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ps), pts.length > 2 ? 24 : 8, r, 14), mat);
  [ps[0], ps[ps.length - 1]].forEach(function (p) {
    const c = new THREE.Mesh(capGeo, mat);
    c.position.copy(p);
    c.scale.setScalar(r);
    m.add(c);
  });
  g.add(m);
  return m;
}
function rod(g, a, b, r, mat, x) { return tube(g, [a, b], r, mat, x); }
function at(g, geo, mat, x, y, z) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m; }

function screenTex() {
  const st = { year: '2016', kmh: 0 };
  const tex = canvasTex(512, 256, function (g, w, h) {
    g.fillStyle = '#0E0F10'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 4; rrect(g, 10, 10, w - 20, h - 20, 26); g.stroke();
    g.fillStyle = '#FE5416'; g.font = '400 128px Anton, Impact, sans-serif'; g.textBaseline = 'alphabetic';
    g.fillText(st.year, 34, 168);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'right'; g.font = '400 112px Anton, Impact, sans-serif';
    g.fillText(String(Math.round(st.kmh)), w - 96, 160);
    g.font = '700 26px Inter, system-ui, sans-serif'; g.fillStyle = 'rgba(255,255,255,.55)';
    g.fillText('KM/H', w - 30, 160);
    g.textAlign = 'left'; g.fillText('TESWAY · DUAL DRIVE', 34, 216);
    for (let i = 0; i < 5; i++) { g.fillStyle = i < 4 ? '#6DD27A' : 'rgba(255,255,255,.18)'; g.fillRect(w - 196 + i * 34, 196, 26, 20); }
  });
  tex.st = st;
  return tex;
}

export function buildBike() {
  const bike = new THREE.Group();
  const g = new THREE.Group();
  bike.add(g);

  const fw = buildWheel(), rw = buildWheel();
  fw.group.position.copy(PT.front); rw.group.position.copy(PT.rear);
  g.add(fw.group, rw.group);

  /* main triangle: hydroformed down tube, sloping top tube, seat tube */
  const down = tube(g, [PT.bb, V(0, 0.46, 0.18), V(0, 0.62, 0.38), PT.headLow], 0.058, paint);
  down.scale.x = 1.45;
  tube(g, [PT.seat, V(0, 0.92, 0.1), PT.headTop.clone().add(V(0, -0.04, -0.01))], 0.028, paint);
  rod(g, PT.bb, PT.seat.clone().add(V(0, 0.04, -0.01)), 0.032, paint);
  rod(g, PT.headLow.clone().add(V(0, -0.03, 0.01)), PT.headTop.clone().add(V(0, 0.03, -0.01)), 0.042, paint);
  [-1, 1].forEach(function (k) {
    tube(g, [PT.bb, V(0, 0.31, -0.32), PT.rear], 0.018, paint, k * 0.075);
    tube(g, [PT.seat.clone().add(V(0, -0.04, -0.02)), V(0, 0.6, -0.42), PT.rear], 0.015, paint, k * 0.07);
  });

  /* battery lives inside the oversized down tube: accent band + key lock */
  const band = tube(g, [V(0, 0.5, 0.235), V(0, 0.545, 0.29)], 0.06, accent);
  band.scale.x = 1.47;
  at(g, new THREE.CylinderGeometry(0.014, 0.014, 0.02, 12), M.alloy, 0.088, 0.4, 0.1).rotation.z = Math.PI / 2;

  /* suspension fork: alloy stanchions into orange lowers */
  [-1, 1].forEach(function (k) {
    rod(g, V(0, 0.7, 0.465), V(0, 0.52, 0.52), 0.022, M.alloy, k * 0.08);
    rod(g, V(0, 0.55, 0.51), PT.front, 0.03, accent, k * 0.08);
  });
  at(g, new THREE.BoxGeometry(0.22, 0.06, 0.09), paint, 0, 0.71, 0.465).rotation.x = -0.25;

  /* cockpit: stem, riser bar, grips, levers, display, headlight */
  rod(g, PT.headTop, V(0, 1.03, 0.47), 0.022, paint);
  const bar = new THREE.CatmullRomCurve3([V(-0.36, 1.05, 0.42), V(-0.16, 1.04, 0.47), V(0.16, 1.04, 0.47), V(0.36, 1.05, 0.42)]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(bar, 32, 0.014, 10), paint));
  [-1, 1].forEach(function (k) {
    const grip = at(g, new THREE.CylinderGeometry(0.019, 0.019, 0.13, 14), M.rubber, k * 0.3, 1.05, 0.435);
    grip.rotation.z = Math.PI / 2; grip.rotation.y = k * 0.25;
    const lever = at(g, new THREE.BoxGeometry(0.12, 0.012, 0.02), M.dark, k * 0.22, 1.035, 0.49);
    lever.rotation.y = k * -0.35;
    tube(g, [V(k * 0.2, 1.045, 0.46), V(k * 0.12, 0.98, 0.56), V(k * 0.04, 0.86, 0.5), V(0, 0.78, 0.45)], 0.004, M.rubber);
  });
  const scr = screenTex();
  const disp = new THREE.Group();
  disp.position.set(0, 1.085, 0.46);
  disp.rotation.x = 0.75;
  at(disp, new THREE.BoxGeometry(0.15, 0.085, 0.022), M.dark, 0, 0, 0.012);
  const glass = at(disp, new THREE.PlaneGeometry(0.135, 0.07), new THREE.MeshBasicMaterial({ map: scr, toneMapped: false }), 0, 0, -0.003);
  glass.rotation.y = Math.PI;
  g.add(disp);
  const lamp = at(g, new THREE.CylinderGeometry(0.026, 0.022, 0.05, 16), M.dark, 0, 0.88, 0.5);
  lamp.rotation.x = Math.PI / 2;
  at(g, new THREE.CircleGeometry(0.02, 16), new THREE.MeshStandardMaterial({ color: 0xF4F4F0, emissive: 0xFFFFFF, emissiveIntensity: 0.4 }), 0, 0.88, 0.526);

  /* seat, crank, chain, fenders */
  rod(g, PT.seat, V(0, 0.99, -0.25), 0.016, M.alloy);
  const sad = at(g, new THREE.CapsuleGeometry(1, 1.4, 6, 16), M.rubber, 0, 1.02, -0.24);
  sad.rotation.x = Math.PI / 2; sad.scale.set(0.075, 0.07, 0.03);
  at(g, new THREE.CylinderGeometry(0.1, 0.1, 0.008, 40), M.disc, 0.06, PT.bb.y, PT.bb.z).rotation.z = Math.PI / 2;
  const crank = new THREE.Group();
  crank.position.copy(PT.bb);
  [-1, 1].forEach(function (k) {
    const arm = at(crank, new THREE.BoxGeometry(0.02, 0.17, 0.03), M.dark, k * 0.1, k * 0.075, 0);
    at(crank, new THREE.BoxGeometry(0.1, 0.02, 0.06), M.rubber, k * 0.16, k * 0.15, 0);
    arm.castShadow = true;
  });
  g.add(crank);
  rod(g, V(0.06, 0.4, -0.06), V(0.06, WR + 0.045, -0.6), 0.005, M.dark);
  rod(g, V(0.06, 0.2, -0.06), V(0.06, WR - 0.045, -0.6), 0.005, M.dark);
  [fw, rw].forEach(function (w, i) {
    const f = new THREE.Mesh(new THREE.TorusGeometry(WR + 0.04, 0.012, 6, 40, 2.1), M.dark);
    f.rotation.y = Math.PI / 2;
    f.rotation.z = i ? 0.7 : 0.35;
    f.scale.z = 6;
    w.group.add(f);
  });
  at(g, new THREE.BoxGeometry(0.06, 0.03, 0.02), new THREE.MeshBasicMaterial({ color: 0xE0261B, toneMapped: false }), 0, 0.82, -0.32);

  g.traverse(function (o) { if (o.isMesh) o.castShadow = true; });

  let lastYear = '', lastKmh = -1;
  function update(dist, kmh, year) {
    const a = dist / WR;
    fw.spin.rotation.x = rw.spin.rotation.x = a;
    crank.rotation.x = a * 0.42;
    const k = Math.round(kmh);
    if (year !== lastYear || k !== lastKmh) { lastYear = year; lastKmh = k; scr.st.year = year; scr.st.kmh = k; scr.redraw(); }
  }
  return { group: bike, update: update, textures: [scr], pt: PT };
}
