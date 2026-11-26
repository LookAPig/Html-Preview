/* ==== about-map.js ==== */
(function () {
  var box = document.getElementById('mapBox');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.map;
  var world = window.TESWAY_WORLD;
  if (!box || !data || !world) return;

  var CROP = { x: 0, y: 1, w: 120, h: 40 };
  var DUR = 5500;
  var regions = data.regions;
  var calm = matchMedia('(prefers-reduced-motion: reduce)');
  var mobile = matchMedia('(max-aspect-ratio: 999/1000)');

  function pt(lon, lat) { return { x: (lon + 180) / world.step, y: (world.top - lat) / world.step + 0.5 }; }
  function pos(p) { return '--x:' + ((p.x - CROP.x) / CROP.w * 100).toFixed(2) + '%;--y:' + ((p.y - CROP.y) / CROP.h * 100).toFixed(2) + '%'; }
  function pad(n) { return String(n).padStart(2, '0'); }

  function dots() {
    var out = '';
    world.rows.forEach(function (row, j) {
      for (var i = 0; i < row.length; i++) {
        if (row[i] === 'x') out += '<circle cx="' + (i + 0.5) + '" cy="' + (j + 0.5) + '" r=".36"/>';
      }
    });
    return out;
  }

  var hq = pt(data.hq.lon, data.hq.lat);
  function arc(p, r) {
    var mx = (hq.x + p.x) / 2, my = (hq.y + p.y) / 2;
    var lift = Math.min(14, Math.abs(hq.x - p.x) * 0.22 + 2);
    return '<path data-r="' + r + '" pathLength="100" d="M' + hq.x.toFixed(2) + ' ' + hq.y.toFixed(2) +
      'Q' + mx.toFixed(2) + ' ' + (my - lift).toFixed(2) + ' ' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + '"/>';
  }

  var arcs = '', pins = '';
  regions.forEach(function (rg, r) {
    rg.pins.forEach(function (p, k) {
      var q = pt(p.lon, p.lat);
      arcs += arc(q, r);
      pins += '<button class="abm__pin" type="button" data-r="' + r + '" data-k="' + k + '" style="' + pos(q) + ';--k:' + k + '" aria-label="' + p.name + ', ' + p.tag + '">' +
        '<i></i><b>' + p.name + '<small>' + p.tag + '</small></b></button>';
    });
  });

  function item(rg, r) {
    return '<li class="abm__item" data-r="' + r + '" tabindex="0" role="tab" aria-selected="false">' +
      '<p class="abm__eyebrow"><span>' + pad(r + 1) + '</span>' + rg.pins.length + ' hubs</p>' +
      '<h3>' + rg.name + '</h3><p class="abm__text">' + rg.text + '</p>' +
      '<ul class="abm__stats">' + rg.stats.map(function (s) { return '<li><b>' + s[0] + '</b>' + s[1] + '</li>'; }).join('') + '</ul>' +
      '<ul class="abm__hubs">' + rg.pins.map(function (p, k) {
        return '<li><button type="button" data-k="' + k + '">' + p.name + '</button></li>';
      }).join('') + '</ul><i class="abm__bar"></i></li>';
  }

  box.innerHTML =
    '<div class="abm__map"><div class="abm__canvas">' +
      '<svg class="abm__svg" viewBox="' + [CROP.x, CROP.y, CROP.w, CROP.h].join(' ') + '" aria-hidden="true">' +
        '<g class="abm__dots">' + dots() + '</g><g class="abm__arcs">' + arcs + '</g></svg>' +
      '<span class="abm__pin abm__pin--hq" style="' + pos(hq) + '"><i></i><b>' + data.hq.name + '<small>' + data.hq.tag + '</small></b></span>' +
      pins +
    '</div></div>' +
    '<ol class="abm__list" role="tablist" aria-label="Regions">' + regions.map(item).join('') + '</ol>';

  var map = box.querySelector('.abm__map');
  var canvas = box.querySelector('.abm__canvas');
  var list = box.querySelector('.abm__list');
  var items = Array.prototype.slice.call(list.children);
  var marks = box.querySelectorAll('.abm__pin[data-r], .abm__arcs path');
  var now = -1, timer = 0, auto = true, seen = false, syncing = 0;

  function hot(k) {
    box.querySelectorAll('.abm__pin[data-r]').forEach(function (p) {
      p.classList.toggle('is-hot', Number(p.dataset.r) === now && Number(p.dataset.k) === k);
    });
  }

  function pan(rg) {
    if (!mobile.matches) { canvas.style.transform = ''; return; }
    var p = pt(rg.lon, rg.lat);
    var cw = canvas.offsetWidth, mw = map.clientWidth;
    var tx = mw / 2 - cw * (p.x - CROP.x) / CROP.w;
    canvas.style.transform = 'translateX(' + Math.max(mw - cw, Math.min(0, tx)).toFixed(1) + 'px)';
  }

  function show(r, scroll) {
    if (r === now) return;
    now = r;
    items.forEach(function (t, k) {
      t.classList.toggle('is-on', k === r);
      t.setAttribute('aria-selected', String(k === r));
    });
    Array.prototype.forEach.call(marks, function (m) { m.classList.toggle('is-on', Number(m.dataset.r) === r); });
    hot(-1);
    pan(regions[r]);
    if (scroll && mobile.matches) {
      syncing = Date.now();
      list.scrollTo({ left: items[r].offsetLeft - list.offsetLeft - parseFloat(getComputedStyle(list).paddingLeft), behavior: 'smooth' });
    }
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    box.classList.remove('is-run');
    if (!auto || !seen || calm.matches) return;
    void box.offsetWidth;
    box.classList.add('is-run');
    timer = setTimeout(function () { show((now + 1) % regions.length, true); }, DUR);
  }

  function pick(r) { auto = false; show(r, true); schedule(); }

  box.style.setProperty('--map-dur', DUR + 'ms');
  list.addEventListener('click', function (e) {
    var it = e.target.closest('.abm__item');
    if (!it) return;
    pick(Number(it.dataset.r));
    var b = e.target.closest('.abm__hubs button');
    if (b) hot(Number(b.dataset.k));
  });
  list.addEventListener('keydown', function (e) {
    var it = e.target.closest('.abm__item');
    if (it && (e.key === 'Enter' || e.key === ' ') && e.target === it) { e.preventDefault(); pick(Number(it.dataset.r)); }
  });
  list.addEventListener('mouseover', function (e) {
    var b = e.target.closest('.abm__item.is-on .abm__hubs button');
    hot(b ? Number(b.dataset.k) : -1);
  });
  canvas.addEventListener('click', function (e) {
    var p = e.target.closest('.abm__pin[data-r]');
    if (p) { pick(Number(p.dataset.r)); hot(Number(p.dataset.k)); }
  });

  var st = 0;
  list.addEventListener('scroll', function () {
    if (!mobile.matches || Date.now() - syncing < 700) return;
    clearTimeout(st);
    st = setTimeout(function () {
      var w = items[1].offsetLeft - items[0].offsetLeft;
      var r = Math.max(0, Math.min(items.length - 1, Math.round(list.scrollLeft / w)));
      if (r !== now) { auto = false; show(r); }
    }, 90);
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      seen = es[0].isIntersecting;
      if (seen) schedule(); else { clearTimeout(timer); box.classList.remove('is-run'); }
    }, { threshold: 0.35 }).observe(box);
  }
  window.addEventListener('resize', function () { pan(regions[now]); });
  show(0);
})();
