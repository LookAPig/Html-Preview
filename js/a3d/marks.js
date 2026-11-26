/* ==== a3d/marks.js · roadside milestone boards + years painted on the road ==== */
import * as THREE from '../vendor/three.module.min.js';
import { C, cl, eo, io, cardTex, yearTex, mobile } from './kit.js';

export const FIRST = 18, GAP = 44, AHEAD = 10;

export function buildMarks(scene, road, list) {
  const group = new THREE.Group();
  scene.add(group);
  const BW = 3.2, BH = 4, LIFT = 0.75;
  const postGeo = new THREE.CylinderGeometry(0.05, 0.05, LIFT + BH * 0.5, 8);
  postGeo.translate(0, (LIFT + BH * 0.5) / 2, -0.06);
  const postMat = new THREE.MeshStandardMaterial({ color: C.ink, roughness: 0.5 });
  const backGeo = new THREE.BoxGeometry(BW + 0.12, BH + 0.12, 0.08);

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
    const back = new THREE.Mesh(backGeo, new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.6 }));
    back.position.set(0, LIFT + BH / 2, -0.05);
    back.castShadow = true;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH), new THREE.MeshBasicMaterial({ map: cardTex(item, i, list.length), transparent: true, toneMapped: false }));
    face.position.set(0, LIFT + BH / 2, 0.002);
    [-1, 1].forEach(function (k) {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.x = k * BW * 0.32;
      post.castShadow = true;
      pivot.add(post);
    });
    pivot.add(back, face);
    group.add(root);

    const decal = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.5), new THREE.MeshBasicMaterial({ map: yearTex(item.year), transparent: true, depthWrite: false, opacity: 0.9 }));
    decal.geometry.rotateX(-Math.PI / 2);
    const df = road.at(s + 4);
    decal.position.copy(df.p).setY(0.04);
    decal.rotation.y = Math.atan2(-df.t.x, -df.t.z);
    group.add(decal);

    return {
      s: s, pivot: pivot, back: back, decal: decal,
      look: new THREE.Vector3(base.x, LIFT + BH * 0.52, base.z)
    };
  });

  const warm = new THREE.Color(C.volt), white = new THREE.Color(0xFFFFFF);
  /* boards stand up as the rider closes in, glow orange at their stop and lie back down once passed */
  function update(dist, grow) {
    group.visible = grow > 0;
    if (!group.visible) return;
    marks.forEach(function (m) {
      const d = m.s - dist;
      const up = eo(cl(1 - (d - 6) / 30)) * (1 - io(cl((-d - 4) / 18)));
      m.pivot.rotation.x = -(1 - up) * Math.PI / 2;
      m.pivot.visible = up > 0.001;
      const on = cl(1 - Math.abs(d) / 9);
      m.on = on;
      m.back.material.color.copy(white).lerp(warm, on);
      m.decal.material.opacity = 0.9 * grow;
    });
  }

  return { marks: marks, update: update, stops: marks.map(function (m) { return m.s; }) };
}
