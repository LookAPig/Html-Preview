/* ==== a3d/tex.js · procedural street textures (asphalt, pavers, curb) ==== */
import * as THREE from '../vendor/three.module.min.js';
import { canvasTex, rand } from './kit.js';

function tile(tex, rx, ry) {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(rx, ry);
  tex.anisotropy = 16;
  return tex;
}

/* fine aggregate + soft patches; one tile = 4 × 4 world units */
export function asphaltTex(rx, ry) {
  const R = rand(11);
  return tile(canvasTex(512, 512, function (g, w, h) {
    g.fillStyle = '#4A4B4D';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {
      const x = R() * w, y = R() * h, r = 40 + R() * 120;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      const c = R() < 0.5 ? '255,255,255' : '0,0,0';
      gr.addColorStop(0, 'rgba(' + c + ',' + (0.025 + R() * 0.03).toFixed(3) + ')');
      gr.addColorStop(1, 'rgba(' + c + ',0)');
      g.fillStyle = gr;
      for (let ox = -w; ox <= w; ox += w) for (let oy = -h; oy <= h; oy += h) g.fillRect(x - r + ox, y - r + oy, r * 2, r * 2);
    }
    const img = g.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (R() - 0.5) * 34 + (R() < 0.02 ? 38 : 0);
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    g.putImageData(img, 0, 0);
  }), rx, ry);
}

/* 60 × 30 cm pavers in running bond; one tile = 2.4 × 2.4 world units */
export function paverTex(rx, ry) {
  const R = rand(23);
  return tile(canvasTex(512, 512, function (g, w, h) {
    g.fillStyle = '#B9B5AE';
    g.fillRect(0, 0, w, h);
    const cw = w / 4, ch = h / 8;
    for (let r = 0; r < 8; r++) {
      const off = r % 2 ? cw / 2 : 0;
      for (let c = -1; c < 5; c++) {
        const t = 196 + Math.floor((R() - 0.5) * 22);
        g.fillStyle = 'rgb(' + t + ',' + (t - 3) + ',' + (t - 8) + ')';
        g.fillRect(c * cw + off + 2, r * ch + 2, cw - 4, ch - 4);
      }
    }
    const img = g.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (R() - 0.5) * 14;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    g.putImageData(img, 0, 0);
  }), rx, ry);
}