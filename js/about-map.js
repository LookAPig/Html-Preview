/* ==== about-map.js · service regions on a dotted world map ==== */
(function () {
  var box = document.getElementById('mapBox');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.map;
  var world = window.TESWAY_WORLD;
  var Show = window.TeswayShow;
  if (!box || !data || !world || !Show) return;

  var CROP = { x: 0, y: 2, w: 120, h: 38 };
  var regions = data.regions;
  var mobile = matchMedia('(max-aspect-ratio: 999/1000)');

  function pt(p) {
    var x = (p.lon + 180) / world.step, y = (world.top - p.lat) / world.step + 0.5;
    return { x: (x - CROP.x) / CROP.w * 100, y: (y - CROP.y) / CROP.h * 100 };
  }

  var dots = '';
  world.rows.forEach(function (row, j) {
    for (var i = 0; i < row.length; i++) {
      if (row[i] === 'x') dots += '<circle cx="' + (i + 0.5) + '" cy="' + (j + 0.5) + '" r=".3"/>';
    }
  });

  function pin(p, r, cls) {
    var q = pt(p);
    return '<button class="abm__pin' + cls + '" type="button" data-r="' + r + '" style="left:' + q.x.toFixed(2) + '%;top:' + q.y.toFixed(2) + '%">' +
      '<i></i><span><b>' + p.name + '</b>' + p.tag + '</span></button>';
  }
  var pins = regions.map(function (rg, r) {
    return rg.pins.map(function (p) { return pin(p, r, ''); }).join('');
  }).join('') + pin(data.hq, -1, ' abm__pin--hq');

  box.innerHTML =
    '<div class="abs__stage">' +
      '<div class="abs__view abm__view"><div class="abm__canvas" id="mapCanvas">' +
        '<svg viewBox="' + [CROP.x, CROP.y, CROP.w, CROP.h].join(' ') + '" aria-hidden="true">' + dots + '</svg>' + pins +
      '</div></div>' +
      '<div class="abs__info" id="mapInfo" aria-live="polite"></div>' +
    '</div>' +
    Show.rail('Regions', regions, function (rg) {
      return '<b>' + rg.name + '</b><small>' + rg.stats[1][0] + ' dealers · ' + rg.stats[2][0] + '</small>';
    });

  var canvas = document.getElementById('mapCanvas');
  var info = document.getElementById('mapInfo');
  var pinEls = Array.prototype.slice.call(canvas.querySelectorAll('.abm__pin'));

  function pan(r) {
    var xs = regions[r].pins.map(function (p) { return pt(p).x / 100; });
    var c = xs.reduce(function (a, b) { return a + b; }, 0) / xs.length;
    var k = canvas.offsetWidth / canvas.parentNode.offsetWidth || 1;
    var shift = Math.min(Math.max(c - 0.5 / k, 0), 1 - 1 / k);
    canvas.style.setProperty('--px', (shift * 100).toFixed(2));
  }

  function render(r) {
    var rg = regions[r];
    pinEls.forEach(function (p) { p.classList.toggle('is-on', Number(p.dataset.r) === r); });
    pan(r);
    Show.swap(info,
      '<p class="abs__kick">Region ' + (r + 1) + ' / ' + regions.length + '</p>' +
      '<h3 class="abs__title">' + rg.name + '</h3>' +
      '<p class="abs__text">' + rg.text + '</p>' +
      '<ul class="abs__stats">' + rg.stats.map(function (s) { return '<li><b>' + s[0] + '</b>' + s[1] + '</li>'; }).join('') + '</ul>');
  }

  var show = Show(box, { dur: 6000, onSelect: render });
  pinEls.forEach(function (p) {
    var r = Number(p.dataset.r);
    if (r > -1) p.addEventListener('click', function () { show.select(r, true); });
  });
  (mobile.addEventListener ? mobile.addEventListener.bind(mobile, 'change') : mobile.addListener.bind(mobile))(function () { pan(show.index()); });
})();
