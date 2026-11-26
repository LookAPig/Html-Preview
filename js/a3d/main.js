/* ==== a3d/main.js · one three.js world behind the whole about stage ==== */
import * as THREE from '../vendor/three.module.min.js';
import { C, seg, mobile } from './kit.js';
import { buildMap } from './map3d.js';
import { buildRoad } from './road.js';
import { buildMarks } from './marks.js';
import { buildCockpit } from './cockpit.js';
import { makeRig, T } from './rig.js';

const cv = document.getElementById('aboutWorld');
const tagBox = document.getElementById('worldTags');
const data = window.TESWAY_ABOUT, world = window.TESWAY_WORLD;

if (cv && data && world) {
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile.matches ? 1.75 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.page);
  scene.fog = new THREE.Fog(C.page, 300, 600);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 1400);
  scene.add(camera);

  scene.add(new THREE.HemisphereLight(0xFFFFFF, 0xCFCFCF, 1.55));
  const sun = new THREE.DirectionalLight(0xFFFFFF, 1.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(mobile.matches ? 1024 : 2048, mobile.matches ? 1024 : 2048);
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 4;
  scene.add(sun, sun.target);

  const floorGeo = new THREE.PlaneGeometry(4000, 4000);
  floorGeo.rotateX(-Math.PI / 2);
  const floor = new THREE.Mesh(floorGeo, new THREE.MeshBasicMaterial({ color: C.page }));
  const shade = new THREE.Mesh(floorGeo, new THREE.ShadowMaterial({ color: 0x222222, opacity: 0.14 }));
  shade.position.y = 0.005;
  shade.receiveShadow = true;
  scene.add(floor, shade);

  const map = buildMap(scene, data.map, world);
  const road = buildRoad(scene, map.hq);
  const marks = buildMarks(scene, road, data.time);
  const cockpit = buildCockpit(camera);
  const rig = makeRig(map, road, marks);

  const tags = map.tags.map(function (tg) {
    const el = document.createElement('span');
    el.className = 'aworld__tag' + (tg.hq ? ' is-hq' : '');
    el.textContent = tg.name;
    tagBox.appendChild(el);
    return el;
  });

  let p = (window.TeswayStage && window.TeswayStage.p) || 0, region = 0, snap = true, W = 1, H = 1, active = -1;
  const proj = new THREE.Vector3();

  function size() {
    W = cv.clientWidth || innerWidth; H = cv.clientHeight || innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }

  function sync(r) {
    camera.fov = r.fov;
    camera.position.copy(r.pos);
    camera.up.set(0, 1, 0);
    camera.lookAt(r.target);
    camera.rotateZ(r.roll);
    if (r.offX || r.offY) camera.setViewOffset(W, H, r.offX * W, r.offY * H, W, H);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    scene.fog.near = r.near; scene.fog.far = r.far;
    const sh = sun.shadow.camera;
    sh.left = sh.bottom = -r.spread; sh.right = sh.top = r.spread;
    sh.near = 1; sh.far = 400;
    sh.updateProjectionMatrix();
    sun.target.position.copy(r.target).setY(0);
    sun.position.copy(sun.target.position).add(proj.set(-40, 90, 30));
  }

  function tagsAt() {
    map.tags.forEach(function (tg, i) {
      const el = tags[i];
      if (tg.w < 0.02) { el.style.opacity = 0; return; }
      proj.copy(tg.pos).project(camera);
      el.style.opacity = tg.w.toFixed(3);
      el.style.transform = 'translate3d(' + ((proj.x + 1) / 2 * W).toFixed(1) + 'px,' + ((1 - proj.y) / 2 * H).toFixed(1) + 'px,0)';
    });
  }

  function storyUi(r) {
    let on = -1;
    marks.marks.forEach(function (m, i) { if (r.dist >= m.s - 9) on = i; });
    if (window.TeswayTime) window.TeswayTime.update(r.u, on);
    return on;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const show = p > 0.15 && p < T.rise[1] + 0.05;
    cv.style.opacity = (1 - seg(p, T.rise[0] + 0.2, T.rise[1] - 0.1)).toFixed(3);
    cv.style.visibility = tagBox.style.visibility = show ? 'visible' : 'hidden';
    if (!show || document.hidden) return;
    const t = now / 1000;
    const r = rig.update(p, t, region, W / H);
    map.update(t, { rise: seg(p, 0.3, 1.25), draw: seg(p, 0.95, 1.8), sink: seg(p, 2.62, 3.35), region: region, snap: snap });
    snap = false;
    const grow = seg(p, 2.75, 3.6);
    road.update(grow);
    marks.update(r.dist, grow);
    active = storyUi(r);
    cockpit.update(r.cockpit, active < 0 ? data.time[0].year : data.time[active].year, r.kmh, r.roll, r.bob);
    sync(r);
    tagsAt();
    renderer.render(scene, camera);
  }

  document.addEventListener('aregion', function (e) { region = e.detail; });
  window.Tesway3D = { set: function (v) { p = v; } };
  addEventListener('resize', size);
  size();
  requestAnimationFrame(frame);
}
