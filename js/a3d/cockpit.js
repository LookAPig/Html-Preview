/* ==== a3d/cockpit.js · first-person handlebar with a live display (year + speed) ==== */
import * as THREE from '../vendor/three.module.min.js';
import { C, canvasTex } from './kit.js';

export function buildCockpit(camera) {
  const rig = new THREE.Group();
  camera.add(rig);
  const metal = new THREE.MeshStandardMaterial({ color: 0x1C1C1C, roughness: 0.45, metalness: 0.4 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.95 });
  const volt = new THREE.MeshStandardMaterial({ color: C.volt, roughness: 0.4, emissive: C.volt, emissiveIntensity: 0.2 });

  const bar = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.42, 0.035, 0.09), new THREE.Vector3(-0.3, 0.02, 0.03), new THREE.Vector3(-0.12, 0, 0),
    new THREE.Vector3(0.12, 0, 0), new THREE.Vector3(0.3, 0.02, 0.03), new THREE.Vector3(0.42, 0.035, 0.09)
  ]);
  rig.add(new THREE.Mesh(new THREE.TubeGeometry(bar, 48, 0.0125, 10), metal));
  [-1, 1].forEach(function (k) {
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.12, 14), rubber);
    grip.rotation.z = Math.PI / 2;
    grip.rotation.y = k * 0.45;
    grip.position.set(k * 0.38, 0.03, 0.07);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.012, 14), volt);
    cap.rotation.copy(grip.rotation);
    cap.position.set(k * 0.44, 0.036, 0.1);
    const lever = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.006, 0.012), metal);
    lever.position.set(k * 0.31, 0.012, -0.03);
    lever.rotation.y = k * 0.3;
    rig.add(grip, cap, lever);
  });

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.14, 12), metal);
  stem.rotation.x = Math.PI / 2 - 0.35;
  stem.position.set(0, -0.025, -0.06);
  rig.add(stem);

  let year = '', kmh = -1;
  const tex = canvasTex(320, 160, function (g, w, h) {
    g.fillStyle = '#141414'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#FE5416'; g.fillRect(18, 18, 6, h - 36);
    g.fillStyle = '#FE5416';
    g.font = '400 64px Anton, Impact, sans-serif';
    g.textBaseline = 'alphabetic';
    g.fillText(year || '----', 40, 92);
    g.fillStyle = 'rgba(255,255,255,.92)';
    g.font = '800 40px Inter, system-ui, sans-serif';
    g.textAlign = 'right';
    g.fillText(kmh < 0 ? '0' : String(kmh), w - 74, 92);
    g.fillStyle = 'rgba(255,255,255,.5)';
    g.font = '700 18px Inter, system-ui, sans-serif';
    g.fillText('KM/H', w - 20, 92);
    g.textAlign = 'left';
    g.fillText('TESWAY · DUAL DRIVE', 40, 132);
    g.fillStyle = '#FE5416';
    g.fillRect(w - 64, 120, 44, 10);
  });
  const shell = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.016), metal);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.136, 0.068), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  screen.position.z = 0.0085;
  const disp = new THREE.Group();
  disp.add(shell, screen);
  disp.position.set(0, 0.05, -0.02);
  disp.rotation.x = -0.5;
  rig.add(disp);

  const hide = new THREE.Vector3();
  /* sit the bar near the bottom edge whatever the fov, so it frames the road like a real cockpit */
  function update(show, y, sp, roll, bob) {
    rig.visible = show > 0.001;
    if (!rig.visible) return;
    const z = -0.78, half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * -z;
    hide.set(0, -half * 0.84 - (1 - show) * 0.5 + bob, z);
    rig.position.copy(hide);
    rig.rotation.set(-0.12, 0, -roll * 0.3);
    const k = Math.round(sp);
    if (y !== year || k !== kmh) { year = y; kmh = k; tex.redraw(); }
  }

  return { update: update };
}
