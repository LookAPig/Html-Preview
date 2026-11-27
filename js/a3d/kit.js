/* ==== a3d/kit.js · math helpers + canvas textures ==== */
import * as THREE from '../vendor/three.module.min.js';

export const C = { page: 0xF6F6F6, ground: 0xEEEEEE, clay: 0xFFFFFF, ink: 0x222222, road: 0x2A2A2A, volt: 0xFE5416 };
export const mobile = matchMedia('(max-aspect-ratio: 999/1000)');
export const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
export function seg(p, a, b) { return cl((p - a) / (b - a)); }
export function io(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
export function eo(t) { return 1 - Math.pow(1 - t, 3); }
export function lerp(a, b, t) { return a + (b - a) * t; }
export function ss(t) { return t * t * (3 - 2 * t); }
export const T = window.TESWAY_T || { hero: [0, 1.6], map: [1.6, 4.6], regions: [1.9, 0.6], dive: [4.6, 6], ride: [6, 11], third: [11, 11.8], tech: [11.8, 0.6], out: [14.2, 14.7], total: 15.4 };

/* map grid: one cell per world unit before the dive, x/z centred on the 120 × 45 world */
export const OX = 60, OZ = 22, CITY = 12;

export function rand(seed) {
  let s = seed;
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export function canvasTex(w, h, draw) {
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.redraw = function () { draw(cv.getContext('2d'), w, h); tex.needsUpdate = true; };
  tex.redraw();
  return tex;
}

/* rounded plate (extruded), centred on x/y, back face at z=0 */
export function plateGeo(w, h, d, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: d * 0.3, bevelSize: Math.min(r * 0.3, d * 0.5), bevelSegments: 3, curveSegments: 8 });
}

export function rrect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function wrap(g, text, x, y, maxW, lh, maxLines) {
  const words = text.split(' ');
  let line = '', n = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, x, y + n * lh);
      line = words[i];
      if (++n >= maxLines) return;
    } else line = test;
  }
  g.fillText(line, x, y + n * lh);
}

export function loadImg(src) {
  return new Promise(function (res) {
    const img = new Image();
    img.onload = function () { res(img); };
    img.onerror = function () { res(null); };
    img.src = src;
  });
}

/* milestone card: same anatomy as the site's white cards (image, Anton year, title, muted copy) */
export function cardTex(item, idx, total) {
  const W = 720, H = 900, P = 28;
  let img = null;
  const tex = canvasTex(W, H, function (g) {
    g.clearRect(0, 0, W, H);
    g.fillStyle = '#FFFFFF';
    rrect(g, 0, 0, W, H, 36); g.fill();
    g.save();
    rrect(g, P, P, W - P * 2, 410, 22); g.clip();
    g.fillStyle = '#F0F0F0'; g.fillRect(P, P, W - P * 2, 410);
    if (img) {
      const bw = W - P * 2, bh = 410, s = Math.max(bw / img.width, bh / img.height);
      g.drawImage(img, P + (bw - img.width * s) / 2, P + (bh - img.height * s) / 2, img.width * s, img.height * s);
    }
    g.restore();
    g.fillStyle = '#FE5416';
    g.font = '400 120px Anton, Impact, sans-serif';
    g.textBaseline = 'alphabetic';
    g.fillText(item.year, P + 16, 590);
    g.fillStyle = 'rgba(34,34,34,.35)';
    g.font = '700 26px Inter, system-ui, sans-serif';
    g.textAlign = 'right';
    g.fillText(String(idx + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0'), W - P - 16, 590);
    g.textAlign = 'left';
    g.fillStyle = '#222222';
    g.font = '800 46px Inter, system-ui, sans-serif';
    g.fillText(item.title, P + 16, 660);
    g.fillStyle = 'rgba(34,34,34,.62)';
    g.font = '400 30px Inter, system-ui, sans-serif';
    wrap(g, item.text, P + 16, 716, W - P * 2 - 32, 44, 4);
    g.fillStyle = '#FE5416';
    g.fillRect(P + 16, H - P - 10, 64, 6);
  });
  tex.ready = Promise.all([loadImg(item.img), document.fonts ? document.fonts.load('400 120px Anton') : null]).then(function (r) {
    img = r[0];
    tex.redraw();
    return tex;
  });
  return tex;
}

/* year painted on the asphalt */
export function yearTex(year) {
  const tex = canvasTex(512, 256, function (g, w, h) {
    g.clearRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,.9)';
    g.font = '400 210px Anton, Impact, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(year, w / 2, h / 2 + 8);
  });
  tex.ready = document.fonts ? document.fonts.load('400 210px Anton').then(function () { tex.redraw(); return tex; }) : Promise.resolve(tex);
  return tex;
}
