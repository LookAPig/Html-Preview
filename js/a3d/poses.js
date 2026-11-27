/* ==== a3d/poses.js · orbit poses {t, d, el, az} for every chapter + interpolation ==== */
import * as THREE from '../vendor/three.module.min.js';
import { lerp, CITY } from './kit.js';

const D2R = Math.PI / 180;
export function pose(t, d, el, az) { return { t: t.clone(), d: d, el: el * D2R, az: az * D2R }; }

/* log distance, linear angles; tk lets the look target travel on its own curve */
export function mix(a, b, k, tk, out) {
  out = out || { t: new THREE.Vector3() };
  out.t.lerpVectors(a.t, b.t, tk === undefined ? k : tk);
  out.d = Math.exp(lerp(Math.log(a.d), Math.log(b.d), k));
  out.el = lerp(a.el, b.el, k);
  out.az = lerp(a.az, b.az, k);
  return out;
}

export function place(p, cam) {
  const c = Math.cos(p.el);
  cam.set(p.t.x + p.d * c * Math.sin(p.az), p.t.y + p.d * Math.sin(p.el), p.t.z + p.d * c * Math.cos(p.az));
  return cam;
}

/* world metres → map-local units around the dive pivot */
export function toLocal(p, P) {
  return { t: p.t.clone().sub(P).multiplyScalar(1 / CITY).add(P), d: p.d / CITY, el: p.el, az: p.az };
}

/* banner fills the viewport like object-fit: cover with the hero's object-position */
export function heroCover(hero, fov, aspect) {
  const tv = Math.tan(fov * D2R / 2);
  const visH = Math.min(hero.h, hero.w / aspect), visW = visH * aspect;
  const t = hero.center.clone();
  t.x += (hero.pos[0] - 0.5) * (hero.w - visW);
  t.y -= (hero.pos[1] - 0.5) * (hero.h - visH);
  return pose(t, visH / 2 / tv, 0, 0);
}

/* pulled back: the billboard sits mid-frame with the dot field and sky around it */
export function heroBack(hero, fov, aspect) {
  const tv = Math.tan(fov * D2R / 2), th = tv * aspect;
  const d = Math.max(hero.w / (2 * 0.5 * th), hero.h / (2 * 0.56 * tv));
  const t = hero.center.clone();
  t.y -= hero.h * 0.12;
  return pose(t, d, 7, 0);
}

/* map: its 120-unit width matches the content column (mobile: 1.7× wider and pans) */
export function mapPose(fov, aspect, frac, small, tx) {
  const th = Math.tan(fov * D2R / 2) * aspect;
  const wide = small ? 1.75 : 1;
  const d = 120 / (2 * th * frac * wide);
  return pose(new THREE.Vector3(tx, 0, small ? 1 : 2.5), d, small ? 66 : 56, 0);
}

/* first person: eye in world metres, pitch down, yaw left positive */
export function riderPose(eye, pitch, yaw) {
  const d = 10, p = pitch * D2R, y = yaw * D2R;
  const t = new THREE.Vector3(eye.x - d * Math.cos(p) * Math.cos(y), eye.y - d * Math.sin(p), eye.z + d * Math.cos(p) * Math.sin(y));
  return { t: t, d: d, el: p, az: Math.PI / 2 + y };
}

/* craft hotspots in bike-local metres, camera az/el in world degrees (bike faces -x) */
export const TECH = [
  { look: [0, 0.62, 0.02], d: 3.5, el: 6, az: 180 },
  { look: [0, 0.52, 0.2], d: 1.75, el: 8, az: 152 },
  { look: [0, 0.84, 0.44], d: 1.6, el: 16, az: 228 },
  { look: [0, 0.86, -0.2], d: 1.25, el: 28, az: 138 }
];
export const HOT = [[0, 0.74, 0.2], [0, 0.5, 0.2], [0, 0.85, 0.43], [0, 0.85, -0.2]];
