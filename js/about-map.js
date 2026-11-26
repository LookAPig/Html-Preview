/* ==== about-map.js ==== */
(function () {
  var box = document.getElementById('mapBox');
  var listEl = document.getElementById('mapList');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.map;
  var world = window.TESWAY_WORLD;
  if (!box || !listEl || !data || !world) return;

  var CROP = { x: 0, y: 2, w: 120, h: 38 };
  var regions = data.regions;

  function pt(lon, lat) { return { x: (lon + 180) / world.step, y: (world.top - lat) / world.step + 0.5 }; }
  function pos(p) { return 'left:' + ((p.x - CROP.x) / CROP.w * 100).toFixed(2) + '%;top:' + ((p.y - CROP.y) / CROP.h * 100).toFixed(2) + '%'; }

  var dots = '';
  world.rows.forEach(function (row, j) {
    for (var i = 0; i < row.length; i++) {
      if (row[i] === 'x') dots += '<circle cx="' + (i + 0.5) + '" cy="' + (j + 0.5) + '" r=".3"/>';
    }
  });

  var k = 0;
  function pin(p, r, cls) {
    return '<button class="abm__pin' + cls + '" type="button" data-r="' + r + '" style="' + pos(pt(p.lon, p.lat)) + ';--k:' + (k++) + '">' +
      '<i></i><span><b>' + p.name + '</b>' + p.tag + '</span></button>';
  }
  var pins = regions.map(function (rg, r) {
    return rg.pins.map(function (p) { return pin(p, r, p.tag === 'Warehouse' ? ' is-wh' : ''); }).join('');
  }).join('') + pin(data.hq, 3, ' abm__pin--hq');

  box.innerHTML =
    '<div class="abm__canvas"><svg viewBox="' + [CROP.x, CROP.y, CROP.w, CROP.h].join(' ') + '" aria-hidden="true">' + dots + '</svg>' + pins + '</div>' +
    '<ul class="abm__legend" aria-hidden="true"><li class="is-hq">Headquarters</li><li class="is-wh">Warehouse</li><li>Showroom &amp; service</li></ul>';

  listEl.innerHTML = regions.map(function (rg, r) {
    return '<li><button class="abm__row" type="button" data-r="' + r + '" aria-pressed="false">' +
      '<span class="abm__name"><b>' + rg.name + '</b><small>' + rg.pins.map(function (p) { return p.name; }).join(' · ') + '</small></span>' +
      '<span class="abm__eta"><b>' + rg.stats[2][0] + '</b>' + rg.stats[2][1] + '</span></button></li>';
  }).join('');

  var rows = Array.prototype.slice.call(listEl.querySelectorAll('.abm__row'));
  var locked = -1;

  function focus(r) {
    box.classList.toggle('has-focus', r > -1);
    box.querySelectorAll('.abm__pin').forEach(function (p) { p.classList.toggle('is-on', Number(p.dataset.r) === r); });
    rows.forEach(function (b) {
      var on = Number(b.dataset.r) === r;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on && locked === r));
    });
  }

  rows.forEach(function (b) {
    var r = Number(b.dataset.r);
    b.addEventListener('mouseenter', function () { focus(r); });
    b.addEventListener('mouseleave', function () { focus(locked); });
    b.addEventListener('click', function () { locked = locked === r ? -1 : r; focus(locked); });
  });

  if (window.TeswayCount) window.TeswayCount.watch(document.getElementById('reach'));
})();
