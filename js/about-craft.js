/* ==== about-craft.js · craftsmanship stats + screen-reader list (the cards live in the 3D HUD) ==== */
(function () {
  var statsEl = document.getElementById('craftStats');
  var listEl = document.getElementById('craftList');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.craft;
  if (!statsEl || !listEl || !data) return;

  statsEl.innerHTML = data.stats.map(function (s) {
    return '<li><b><span data-count="' + s.value + '">0</span><small>' + s.unit + '</small></b>' + s.label + '</li>';
  }).join('');
  listEl.innerHTML = data.points.map(function (p) { return '<li>' + p.title + ': ' + p.text + '</li>'; }).join('');

  window.TeswayOnScene('craft', function (on) { if (on) window.TeswayCount(statsEl, 100); });
})();
