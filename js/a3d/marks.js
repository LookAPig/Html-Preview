/* ==== a3d/marks.js · roadside milestone boards + years painted on the road ==== */
import * as THREE from '../vendor/three.module.min.js';
import { C, cl, eo, io, cardTex, yearTex, plateGeo, mobile } from './kit.js';

export const FIRST = 18, GAP = 44, AHEAD = 10;

export function buildMarks(scene, road, list) {
  const group = new THREE.Group();
  scene.add(group);
  const BW = 3.2, BH = 4, LIFT = 0.9, Y = LIFT + BH / 2;
  const plate = plateGeo(BW + 0.16, BH + 0.16, 0.06, 0.24);
  const rim = plateGeo(BW + 0.34, BH + 0.34, 0.02, 0.32);
  const postGeo = new THREE.CylinderGeometry(0.06, 0.06, Y, 16);
  postGeo.translate(0, Y / 2, -0.1);
  const footGeo = new THREE.CylinderGeometry(0.42, 0.48, 0.08, 32);
  footGeo.translate(0, 0.04, -0.1);
  const inkMat = new THREE.MeshStandardMaterial({ color: C.ink, roughness: 0.45, metalness: 0.2 });
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.55 });
  const textures = [];

  const marks = list.map(function (item, i) {
    const s = FIRST + i * GAP;
    const side = i % 2 ? -1 : 1;
    const off = mobile.matches ? 3.4 : 4.2;
    const f = road.at(s + AHEAD), stop = road.at(s);
    const base = f.p.clone().addScaledVector(f.n, side * off);

    const root = new THREE.Group();
    root.position.copy(base);
    root.lookAt(stop.p.x, 0, stop.p.z);
    const pivot = new THREE.Group();
    root.add(pivot);

    const back = new THREE.Mesh(plate, plateMat);
    back.position.set(0, Y, -0.08);
    back.castShadow = true;
    const glow = new THREE.Mesh(rim, new THREE.MeshBasicMaterial({ color: C.volt, transparent: true, opacity: 0, depthWrite: false }));
    glow.position.set(0, Y, -0.1);
    const tex = cardTex(item, i, list.length);
    textures.push(tex);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
    face.position.set(0, Y, 0.005);
    const post = new THREE.Mesh(postGeo, inkMat), foot = new THREE.Mesh(footGeo, inkMat);
    post.castShadow = true;
    pivot.add(post, foot, glow, back, face);
    group.add(root);

    const ytex = yearTex(item.year);
    textures.push(ytex);
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.5), new THREE.MeshBasicMaterial({ map: ytex, transparent: true, depthWrite: false, opacity: 0.9 }));
    decal.geometry.rotateX(-Math.PI / 2);
    const df = road.at(s + 4);
    decal.position.copy(df.p).setY(0.04);
    decal.rotation.y = Math.atan2(-df.t.x, -df.t.z);
    group.add(decal);

    return {
      s: s, pivot: pivot, glow: glow, decal: decal,
      look: new THREE.Vector3(base.x, Y, base.z),
      hub: base.clone().addScaledVector(f.n, side * 10).addScaledVector(f.t, 4)
    };
  });

  /* boards stand up as the rider closes in, glow orange at their stop and lie back down once passed */
  function update(dist, grow) {
    group.visible = grow > 0;
    if (!group.visible) return;
    marks.forEach(function (m) {
      const d = m.s - dist;
      const up = eo(cl(1 - (d - 4) / 34)) * (1 - io(cl((-d - 1.5) / 7)));
      m.pivot.rotation.x = -(1 - up) * Math.PI / 2;
      m.pivot.visible = up > 0.001;
      m.on = io(cl(1 - Math.abs(d) / 12));
      m.glow.material.opacity = m.on;
      m.decal.material.opacity = 0.9 * grow;
    });
  }

  return { marks: marks, update: update, textures: textures, stops: marks.map(function (m) { return m.s; }) };
}
