/* ==== about-craft.js · frame craft hotspots ==== */
(function () {
  var box = document.getElementById('craftBox');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.craft;
  var Show = window.TeswayShow;
  if (!box || !data || !Show) return;

  var pts = data.points;
  var WAVE = '<svg class="abc__wave" viewBox="0 0 160 14" fill="none" aria-hidden="true">' +
    '<path pathLength="1" d="M4 9.5C16 3 26 2.5 36 6.5s17 6.5 30 2.5 22-7.5 34-3.5 19 6 31 2.5 15-4.5 25-3"/></svg>';
  function pad(n) { return String(n).padStart(2, '0'); }

  box.innerHTML =
    '<div class="abs__stage">' +
      '<div class="abs__view abc__view">' +
        '<img src="' + data.img + '" alt="TESWAY X1 Dual-Drive frame" loading="lazy" decoding="async">' +
        pts.map(function (p, i) {
          return '<button class="abc__spot" type="button" style="left:' + p.x + '%;top:' + p.y + '%" aria-label="' + p.title + '">' + pad(i + 1) + '</button>';
        }).join('') +
      '</div>' +
      '<div class="abs__info">' +
        '<div id="craftInfo" aria-live="polite"></div>' +
        '<ul class="abs__stats">' + data.stats.map(function (s) {
          return '<li><b>' + s.value + '<small>' + s.unit + '</small></b>' + s.label + '</li>';
        }).join('') + '</ul>' +
      '</div>' +
    '</div>' +
    Show.rail('Craft process', pts, function (p, i) {
      return '<small class="abc__no">' + pad(i + 1) + '</small><b>' + p.title + '</b>' + WAVE;
    });

  var info = document.getElementById('craftInfo');
  var spots = Array.prototype.slice.call(box.querySelectorAll('.abc__spot'));

  var show = Show(box, {
    dur: 5000,
    onSelect: function (i) {
      spots.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      Show.swap(info,
        '<p class="abs__kick">Frame lab · ' + pad(i + 1) + ' / ' + pad(pts.length) + '</p>' +
        '<h3 class="abs__title">' + pts[i].title + '</h3>' +
        '<p class="abs__text">' + pts[i].text + '</p>');
    }
  });
  spots.forEach(function (s, i) { s.addEventListener('click', function () { show.select(i, true); }); });
})();
