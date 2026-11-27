/* ==== a3d/boards.js · hero billboard (the banner) + milestone city-light panels along the street ==== */
import * as THREE from '../vendor/three.module.min.js';
import { mobile, plateGeo, cardTex, yearTex } from './kit.js';
import { LANE } from './street.js';

export const FIRST = 22, GAP = 40;
const steel = new THREE.MeshStandardMaterial({ color: 0x2C2E31, roughness: 0.42, metalness: 0.7 });

/* banner billboard: face bottom at y = 4, centred on x = 0, facing +z towards the camera */
export function buildHero(scene) {
  const g = new THREE.Group();
  g.position.set(0, 0, 36);
  scene.add(g);
  const loader = new THREE.TextureLoader();
  const faceMat = new THREE.MeshBasicMaterial({ color: 0xDDDDDD, toneMapped: false, fog: false });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), faceMat);
  const frame = new THREE.Mesh(new THREE.BufferGeometry(), steel);
  frame.castShadow = true;
  g.add(face, frame);

  const postGeo = new THREE.BoxGeometry(0.7, 1, 0.7);
  postGeo.translate(0, 0.5, 0);
  const posts = [new THREE.Mesh(postGeo, steel), new THREE.Mesh(postGeo, steel)];
  const brace = new THREE.Mesh(new THREE.BoxGeometry(1, 0.32, 0.32), steel);
  const lampGeo = new THREE.BoxGeometry(1.4, 0.22, 0.5);
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x3A3C40, emissive: 0xFFF2DC, emissiveIntensity: 0.2, metalness: 0.6, roughness: 0.4 });
  const lamps = [0, 1, 2, 3].map(function () { const l = new THREE.Mesh(lampGeo, lampMat); g.add(l); return l; });
  posts.forEach(function (p) { p.castShadow = true; g.add(p); });
  g.add(brace);

  const hero = { group: g, w: 32, h: 18, bottom: 4, pos: [0.68, 0.5], center: new THREE.Vector3() };
  const tex = {};
  function layout() {
    const m = mobile.matches;
    hero.h = m ? 26 : 18;
    hero.w = hero.h * (m ? 720 / 1280 : 1280 / 720);
    hero.pos = m ? [0.5, 1] : [0.68, 0.5];
    const W = hero.w, H = hero.h, y = hero.bottom + H / 2;
    face.scale.set(W, H, 1);
    face.position.set(0, y, 0.66);
    frame.geometry.dispose();
    frame.geometry = plateGeo(W + 0.9, H + 0.9, 0.5, 0.3);
    frame.position.set(0, y, 0);
    posts.forEach(function (p, i) { p.scale.set(1, hero.bottom + 0.5, 1); p.position.set((i ? 1 : -1) * W * 0.3, 0, -0.2); });
    brace.scale.x = W * 0.6;
    brace.position.set(0, hero.bottom * 0.5, -0.2);
    lamps.forEach(function (l, i) { l.position.set((i / 3 - 0.5) * W * 0.8, hero.bottom + H + 0.9, 1.1); });
    hero.center.set(0, y, g.position.z + 0.66);
    const src = m ? 'Images/hero-mobile.jpg' : 'Images/hero-desktop.jpg';
    if (!tex[src]) {
      tex[src] = loader.load(src, function (t) { if (hero.onTex) hero.onTex(t); });
      tex[src].colorSpace = THREE.SRGBColorSpace;
      tex[src].anisotropy = 8;
    }
    faceMat.map = tex[src];
    faceMat.color.set(0xFFFFFF);
    faceMat.needsUpdate = true;
  }
  layout();
  mobile.addEventListener('change', layout);

  /* after the pull-back the billboard folds down into the ground so the map has the stage */
  hero.update = function (sink) {
    g.visible = sink < 0.999;
    g.rotation.x = sink * Math.PI * 0.5;
  };
  return hero;
}

export function buildPanels(wg, items, xs, zc) {
  const g = new THREE.Group();
  wg.add(g);
  const textures = [];
  const legGeo = new THREE.BoxGeometry(0.1, 0.6, 0.1);
  legGeo.translate(0, 0.3, 0);
  const W = 3.2, H = 4, B = 0.65;
  const panels = items.map(function (it, i) {
    const side = i % 2 ? 1 : -1;
    const s = FIRST + i * GAP;
    const p = new THREE.Group();
    p.position.set(xs - s, 0.16, zc + side * 6.4);
    p.rotation.y = side < 0 ? Math.PI / 3 : Math.PI * 2 / 3;
    const frame = new THREE.Mesh(plateGeo(W + 0.28, H + 0.28, 0.22, 0.08), steel);
    frame.position.set(0, B + H / 2, -0.12);
    const ct = cardTex(it, i, items.length);
    textures.push(ct);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: ct, transparent: true, toneMapped: false }));
    face.position.set(0, B + H / 2, 0.2);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshStandardMaterial({ color: 0xF1F1F1, roughness: 0.6 }));
    back.position.set(0, B + H / 2, -0.2);
    back.rotation.y = Math.PI;
    const legs = [-1, 1].map(function (k) { const l = new THREE.Mesh(legGeo, steel); l.position.x = k * W * 0.35; l.scale.y = B / 0.6 + 0.2; return l; });
    frame.castShadow = true;
    p.add(frame, face, back, legs[0], legs[1]);
    g.add(p);

    const yt = yearTex(it.year);
    textures.push(yt);
    const yg = new THREE.PlaneGeometry(1.25, 2.6);
    yg.rotateX(-Math.PI / 2);
    const year = new THREE.Mesh(yg, new THREE.MeshBasicMaterial({ map: yt, transparent: true, depthWrite: false, opacity: 0.85, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }));
    year.rotation.y = Math.PI / 2;
    year.position.set(xs - s + 11, 0.04, zc + LANE);
    g.add(year);
    return { s: s, side: side, obj: p, at: new THREE.Vector3(xs - s, B + H / 2, zc + side * 6.4) };
  });
  function update(dive) { g.visible = dive > 0.2; }
  update(0);
  return { panels: panels, textures: textures, update: update };
}
