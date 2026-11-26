/* ==== about-map.js ==== */
(function () {
  var box = document.getElementById('mapBox');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.map;
  var world = window.TESWAY_WORLD;
  if (!box || !data || !world) return;

  var CROP = { x: 0, y: 1, w: 120, h: 40 };
  var DUR = 6000;
  var regions = data.regions;
  var calm = matchMedia('(prefers-reduced-motion: reduce)');
  var pc = matchMedia('(min-aspect-ratio: 1/1)');

  function pt(lon, lat) { return { x: (lon + 180) / world.step, y: (world.top - lat) / world.step + 0.5 }; }
  function pos(p) { return 'left:' + ((p.x - CROP.x) / CROP.w * 100).toFixed(2) + '%;top:' + ((p.y - CROP.y) / CROP.h * 100).toFixed(2) + '%'; }
  function pad(n) { return String(n).padStart(2, '0'); }

  function dots() {
    var out = '';
    world.rows.forEach(function (row, j) {
      for (var i = 0; i < row.length; i++) {
        if (row[i] === 'x') out += '<circle cx="' + (i + 0.5) + '" cy="' + (j + 0.5) + '" r=".3"/>';
      }
    });
    return out;
  }

  var hq = pt(data.hq.lon, data.hq.lat);
  function arc(p, r) {
    var lift = Math.min(12, Math.abs(hq.x - p.x) * 0.2 + 1.5);
    return '<path data-r="' + r + '" pathLength="100" d="M' + hq.x.toFixed(2) + ' ' + hq.y.toFixed(2) + 'Q' +
      ((hq.x + p.x) / 2).toFixed(2) + ' ' + ((hq.y + p.y) / 2 - lift).toFixed(2) + ' ' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + '"/>';
  }

  var arcs = '', pins = '';
  regions.forEach(function (rg, r) {
    rg.pins.forEach(function (p, k) {
      var q = pt(p.lon, p.lat);
      arcs += arc(q, r);
      pins += '<button class="abm__pin" type="button" data-r="' + r + '" data-k="' + k + '" style="' + pos(q) + '" aria-label="' + p.name + ', ' + p.tag + '">' +
        '<i></i><b>' + p.name + '<small>' + p.tag + '</small></b></button>';
    });
  });

  function item(rg, r) {
    return '<li class="abm__item" data-r="' + r + '">' +
      '<button class="abm__head" type="button" aria-expanded="false"><span class="abm__no">' + pad(r + 1) + '</span>' +
        '<b>' + rg.name + '</b><small>' + rg.pins.length + ' hubs</small><i class="abm__pm" aria-hidden="true"></i></button>' +
      '<div class="abm__body"><div><p class="abm__text">' + rg.text + '</p>' +
        '<ul class="abm__stats">' + rg.stats.map(function (s) { return '<li><b>' + s[0] + '</b>' + s[1] + '</li>'; }).join('') + '</ul>' +
        '<ul class="abm__hubs">' + rg.pins.map(function (p, k) {
          return '<li><button type="button" data-k="' + k + '">' + p.name + '</button></li>';
        }).join('') + '</ul></div></div><i class="abm__bar"></i></li>';
  }

  box.innerHTML =
    '<div class="abm__stage"><div class="abm__canvas">' +
      '<svg class="abm__svg" viewBox="' + [CROP.x, CROP.y, CROP.w, CROP.h].join(' ') + '" aria-hidden="true">' +
        '<g class="abm__dots">' + dots() + '</g><g class="abm__arcs">' + arcs + '</g></svg>' +
      '<span class="abm__pin abm__pin--hq" style="' + pos(hq) + '"><i></i><b>' + data.hq.name + '<small>' + data.hq.tag + '</small></b></span>' +
      pins + '</div><p class="abm__coord" aria-hidden="true"></p></div>' +
    '<div class="abm__panel"><p class="abm__label">Service network</p><ol class="abm__list">' + regions.map(item).join('') + '</ol></div>';

  var stage = box.querySelector('.abm__stage');
  var canvas = box.querySelector('.abm__canvas');
  var panel = box.querySelector('.abm__panel');
  var coord = box.querySelector('.abm__coord');
  var items = Array.prototype.slice.call(box.querySelectorAll('.abm__item'));
  var marks = box.querySelectorAll('.abm__pin[data-r], .abm__arcs path');
  var now = -1, timer = 0, auto = true, seen = false;

  function hot(k) {
    box.querySelectorAll('.abm__pin[data-r]').forEach(function (p) {
      p.classList.toggle('is-hot', Number(p.dataset.r) === now && Number(p.dataset.k) === k);
    });
  }

  function view() {
    if (now < 0) return;
    var rg = regions[now];
    var W = stage.clientWidth, H = stage.clientHeight, ch = W * CROP.h / CROP.w;
    var wide = !box.classList.contains('is-zoom');
    var z = Math.max(wide ? 1 : rg.zoom, H / ch);
    var p = wide ? { x: CROP.x + CROP.w / 2, y: CROP.y + CROP.h / 2 } : pt(rg.lon, rg.lat);
    var cx = (p.x - CROP.x) / CROP.w * W, cy = (p.y - CROP.y) / CROP.h * ch;
    var left = pc.matches ? panel.offsetLeft + panel.offsetWidth : 0;
    var tx = Math.min(0, Math.max(W - W * z, (wide ? W / 2 : left + (W - left) / 2) - cx * z));
    var ty = Math.min(0, Math.max(H - ch * z, H / 2 - cy * z));
    canvas.style.width = W + 'px';
    canvas.style.height = ch + 'px';
    canvas.style.setProperty('--z', z.toFixed(3));
    canvas.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0) scale(' + z.toFixed(3) + ')';
    coord.textContent = Math.abs(rg.lat) + '°' + (rg.lat < 0 ? 'S' : 'N') + ' · ' + Math.abs(rg.lon) + '°' + (rg.lon < 0 ? 'W' : 'E') + ' · ×' + rg.zoom.toFixed(1);
  }

  function show(r) {
    if (r === now) return schedule();
    now = r;
    items.forEach(function (it, k) {
      it.classList.toggle('is-open', k === r);
      it.firstChild.setAttribute('aria-expanded', String(k === r));
    });
    Array.prototype.forEach.call(marks, function (m) { m.classList.toggle('is-on', Number(m.dataset.r) === r); });
    hot(-1);
    view();
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    box.classList.remove('is-run');
    if (!auto || !seen || calm.matches) return;
    void box.offsetWidth;
    box.classList.add('is-run');
    timer = setTimeout(function () { show((now + 1) % regions.length); }, DUR);
  }

  function pick(r) { auto = false; show(r); }

  box.style.setProperty('--map-dur', DUR + 'ms');
  panel.addEventListener('click', function (e) {
    var it = e.target.closest('.abm__item');
    if (!it) return;
    pick(Number(it.dataset.r));
    var b = e.target.closest('.abm__hubs button');
    if (b) hot(Number(b.dataset.k));
  });
  panel.addEventListener('mouseover', function (e) {
    var b = e.target.closest('.abm__item.is-open .abm__hubs button');
    hot(b ? Number(b.dataset.k) : -1);
  });
  canvas.addEventListener('click', function (e) {
    var p = e.target.closest('.abm__pin[data-r]');
    if (p) { pick(Number(p.dataset.r)); hot(Number(p.dataset.k)); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      seen = es[0].isIntersecting;
      if (seen && !box.classList.contains('is-zoom')) {
        setTimeout(function () { box.classList.add('is-zoom'); view(); }, calm.matches ? 0 : 1100);
      }
      if (seen) schedule(); else { clearTimeout(timer); box.classList.remove('is-run'); }
    }, { threshold: 0.35 }).observe(box);
  }
  window.addEventListener('resize', view);
  show(0);
})();
