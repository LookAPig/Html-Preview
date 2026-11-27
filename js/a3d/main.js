/* ==== a3d/main.js · one three.js world for the whole about stage ==== */
import * as THREE from '../vendor/three.module.min.js';
import { T, seg, mobile } from './kit.js';
import { buildSky } from './sky.js';
import { buildCity, ROAD_Z } from './city.js';
import { grid, mapRegions, buildHubs } from './hubs.js';
import { worldGroup, buildStreet } from './street.js';
import { buildHero, buildPanels } from './boards.js';
import { buildBike } from './bike.js';
import { makeRig, RIDE } from './rig.js';
import { buildHud } from './hud.js';

const cv = document.getElementById('aboutWorld');
const hudBox = document.getElementById('aboutHud');
const data = window.TESWAY_ABOUT, world = window.TESWAY_WORLD;

if (cv && data && world) {
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile.matches ? 1.6 : 1.5));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xF2F3F4, 900, 2400);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 2400);
  const sky = buildSky(renderer, scene);

  const floorGeo = new THREE.PlaneGeometry(6000, 6000);
  floorGeo.rotateX(-Math.PI / 2);
  /* ground never writes depth: it is drawn first like a backdrop, so nothing can z-fight with it */
  const floorMat = new THREE.MeshBasicMaterial({ color: 0xF6F6F6, toneMapped: false, depthWrite: false });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.renderOrder = -5;
  const shade = new THREE.Mesh(floorGeo, new THREE.ShadowMaterial({ color: 0x1E2226, opacity: 0.14, depthWrite: false }));
  shade.renderOrder = -4;
  shade.receiveShadow = true;
  scene.add(floor, shade);
  const page = new THREE.Color(0xF6F6F6), concrete = new THREE.Color(0xC9C6C0);

  const hq = grid(world, data.map.hq);
  const P = new THREE.Vector3(hq.x, 0, ROAD_Z);
  const root = new THREE.Group();
  scene.add(root);
  const regions = mapRegions(world, data.map);
  const city = buildCity(root, world, regions, hq);
  const hubs = buildHubs(root, regions, hq);
  const wg = worldGroup(root, P);
  const street = buildStreet(wg, P, 340);
  const xs = P.x + 4;
  const panels = buildPanels(wg, data.time, xs, P.z);
  const END = panels.panels[panels.panels.length - 1].s + 26;
  const bike = buildBike();
  bike.group.rotation.y = -Math.PI / 2;
  wg.add(bike.group);
  const hero = buildHero(scene);
  const rig = makeRig({ P: P, regions: regions, hero: hero, xs: xs, panels: panels.panels, END: END });
  const hud = buildHud(data, hubs.tags);

  /* scroll position (stage p) at which each milestone panel is just ahead of the rider */
  window.TeswayRideStops = panels.panels.map(function (pn) {
    const goal = (pn.s - 9) / END;
    let a = 0, b = 1;
    for (let i = 0; i < 30; i++) {
      const m = (a + b) / 2, f = m - Math.sin(2 * Math.PI * m) / (2 * Math.PI);
      if (f < goal) a = m; else b = m;
    }
    return RIDE[0] + a * (RIDE[1] - RIDE[0]);
  });

  const stage = window.TeswayStage;
  if (stage) stage.ext = true;
  let p = stage ? stage.p : 0, W = 1, H = 1, frac = 0.86, shown = null;

  function size() {
    W = cv.clientWidth || innerWidth; H = cv.clientHeight || innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const pad = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pad')) * rem || 20;
    frac = Math.max(0.5, (W - pad * 2) / W);
    hud.size(W, H);
  }

  function sync(r) {
    camera.fov = r.fov;
    camera.near = r.near; camera.far = r.far;
    camera.position.copy(r.pos);
    camera.up.set(0, 1, 0);
    camera.lookAt(r.target);
    if (r.roll) camera.rotateZ(r.roll);
    if (r.offY) camera.setViewOffset(W, H, 0, -r.offY * H, W, H);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    scene.fog.near = r.fogNear; scene.fog.far = r.fogFar;
    sky.aim(r.shadow, r.spread, camera);
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (stage && stage.step) { stage.step(now); p = stage.p; }
    const show = p < T.out[1] + 0.02;
    if (show !== shown) {
      shown = show;
      cv.style.visibility = show ? 'visible' : 'hidden';
      hudBox.style.display = show ? '' : 'none';
      hudBox.style.visibility = 'visible';
    }
    if (!show || document.hidden) return;
    const fade = 1 - seg(p, T.out[0], T.out[1]);
    cv.style.opacity = fade.toFixed(3);
    const t = now / 1000;
    const r = rig.update(p, W / H, frac, mobile.matches);
    root.scale.setScalar(r.S);
    root.position.copy(P).multiplyScalar(1 - r.S);
    city.update({ aw: r.aw, act: r.act, dive: r.dive });
    hubs.update(t, { aw: r.aw, act: r.act, show: seg(p, 1.0, 1.7), fade: 1 - seg(r.dive, 0, 0.22) });
    street.update(r.dive);
    panels.update(r.dive);
    hero.update(r.sink);
    bike.group.visible = r.dive > 0.7;
    bike.group.position.copy(r.bike);
    bike.update(r.dist, r.kmh, data.time[r.active].year);
    floorMat.color.copy(page).lerp(concrete, seg(r.dive, 0.3, 0.8));
    shade.visible = r.dive < 0.1;
    sync(r);
    root.updateMatrixWorld();
    hud.update(r, root, camera, fade);
    if (window.TeswayTime && p > T.dive[1] - 0.3 && p < T.third[1]) window.TeswayTime.update(r.u, r.active);
    renderer.render(scene, camera);
  }

  addEventListener('resize', size);
  size();

  /* compile every program and upload every texture before the first scroll */
  camera.position.set(0, 120, 160);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  wg.traverse(function (o) { o.visible = true; });
  renderer.compile(scene, camera);
  street.update(0); panels.update(0);
  street.textures.concat(panels.textures, bike.textures).forEach(function (tx) {
    renderer.initTexture(tx);
    if (tx.ready) tx.ready.then(function () { renderer.initTexture(tx); });
  });
  hero.onTex = function (tx) { renderer.initTexture(tx); };
  requestAnimationFrame(frame);
  document.body.classList.add('is-world');
}
