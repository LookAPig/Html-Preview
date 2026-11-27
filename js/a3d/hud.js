/* ==== a3d/hud.js · HTML cards + labels pinned to 3D anchors (regions on the map, hotspots on the bike) ==== */
import * as THREE from '../vendor/three.module.min.js';
import { mobile } from './kit.js';

function pad(n) { return String(n).padStart(2, '0'); }

function regionHtml(rg, i, n) {
  const meta = rg.meta.split(' · ').map(function (m) {
    const s = m.match(/^([\d–+,.]+\+?)\s*(.*)$/);
    return s ? '<li><b>' + s[1] + '</b>' + s[2] + '</li>' : '<li>' + m + '</li>';
  }).join('');
  return '<p class="ahud__no"><b>' + pad(i + 1) + '</b> / ' + pad(n) + '</p>' +
    '<h3>' + rg.name + '</h3><p class="ahud__sub">' + rg.label + ' and beyond</p>' +
    '<ul class="ahud__meta">' + meta + '</ul>' +
    '<p class="ahud__pins">' + rg.pins.map(function (p) { return '<span>' + p.name + '</span>'; }).join('') + '</p>';
}

function techHtml(pt, i, n) {
  return '<p class="ahud__no"><b>' + pad(i + 1) + '</b> / ' + pad(n) + '<span class="ahud__chip">' + pt.chip + '</span></p>' +
    '<h3>' + pt.title + '</h3><p class="ahud__text">' + pt.text + '</p>';
}

export function buildHud(data, tags) {
  const box = document.getElementById('aboutHud');
  const card = document.getElementById('hudCard');
  const pin = document.getElementById('hudPin');
  const line = document.createElement('i');
  line.className = 'ahud__line';
  line.setAttribute('aria-hidden', 'true');
  box.insertBefore(line, pin);
  const tagEls = tags.map(function (tg, i) {
    const el = document.createElement('span');
    el.className = 'ahud__tag' + (i === 0 ? ' is-hq' : '') + (tg.big ? ' is-big' : '');
    el.textContent = tg.name;
    el.setAttribute('aria-hidden', 'true');
    box.appendChild(el);
    return el;
  });
  const v = new THREE.Vector3();
  let key = '', W = 1, H = 1, cw = 0, ch = 0, cardOp = -1;

  function size(w, h) { W = w; H = h; key = ''; }

  function project(pos, root, cam) {
    v.copy(pos);
    if (root) v.applyMatrix4(root.matrixWorld);
    v.project(cam);
    return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, ok: v.z < 1 };
  }

  function show(el, w, x, y) {
    if (w < 0.01) { if (el.style.opacity !== '0') el.style.opacity = '0'; return; }
    el.style.opacity = w.toFixed(3);
    el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
  }

  /* r: rig output · root: map group (labels live in map-local space) */
  function update(r, root, cam, fade) {
    tags.forEach(function (tg, i) {
      const w = tg.w * fade;
      if (w < 0.01) { show(tagEls[i], 0); return; }
      const s = project(tg.pos, root, cam);
      show(tagEls[i], s.ok ? w : 0, s.x, s.y);
    });

    let k = '', w = 0, anchor = null;
    if (r.region >= 0 && r.regionW > 0.001) { k = 'r' + r.region; w = r.regionW; anchor = project(r.anchor, root, cam); }
    else if (r.tech >= 0 && r.techW > 0.001) { k = 't' + r.tech; w = r.techW; anchor = project(r.hot, null, cam); }
    w *= fade;
    if (k && k !== key) {
      key = k;
      const i = Number(k.slice(1));
      card.className = 'ahud__card ' + (k[0] === 'r' ? 'is-region' : 'is-tech');
      card.innerHTML = k[0] === 'r' ? regionHtml(data.map.regions[i], i, data.map.regions.length) : techHtml(data.craft.points[i], i, data.craft.points.length);
      cw = card.offsetWidth; ch = card.offsetHeight;
    }
    if (!anchor || w < 0.01) {
      if (cardOp !== 0) { cardOp = 0; card.style.opacity = line.style.opacity = pin.style.opacity = '0'; card.style.visibility = 'hidden'; }
      return;
    }
    if (cardOp === 0) card.style.visibility = 'visible';
    cardOp = w;
    show(pin, w, anchor.x, anchor.y);
    card.style.opacity = w.toFixed(3);
    let x = 0, y = 0;
    if (mobile.matches) {
      card.style.transform = 'translate3d(0,' + ((1 - w) * 16).toFixed(1) + 'px,0)';
      x = W / 2; y = H - ch - 24;
    } else {
      /* card sits on the far side of the anchor (map: lower corner, bike: mid-height) with a leader line */
      const left = key[0] === 'r' && anchor.x > W * 0.5, side = Math.max(24, W * 0.07);
      const cx = left ? side : W - side - cw;
      const cy = key[0] === 'r' ? H - ch - Math.max(120, H * 0.17) : (H - ch) / 2;
      card.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + (cy + (1 - w) * 14).toFixed(1) + 'px,0)';
      x = left ? cx + cw : cx; y = cy + Math.min(ch * 0.5, 48);
    }
    const dx = x - anchor.x, dy = y - anchor.y, len = Math.sqrt(dx * dx + dy * dy);
    line.style.opacity = (w * 0.9).toFixed(3);
    line.style.width = (len * w).toFixed(1) + 'px';
    line.style.transform = 'translate3d(' + anchor.x.toFixed(1) + 'px,' + anchor.y.toFixed(1) + 'px,0) rotate(' + Math.atan2(dy, dx).toFixed(4) + 'rad)';
  }

  return { update: update, size: size };
}
