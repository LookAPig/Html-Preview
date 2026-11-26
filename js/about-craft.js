/* ==== about-craft.js · craftsmanship stats + cards ==== */
(function () {
  var statsEl = document.getElementById('craftStats');
  var listEl = document.getElementById('craftList');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.craft;
  if (!statsEl || !listEl || !data) return;

  var WAVE = '<svg class="acard__wave" viewBox="0 0 160 14" fill="none" aria-hidden="true">' +
    '<path pathLength="1" d="M4 9.5C16 3 26 2.5 36 6.5s17 6.5 30 2.5 22-7.5 34-3.5 19 6 31 2.5 15-4.5 25-3"/></svg>';
  function pad(n) { return String(n).padStart(2, '0'); }

  statsEl.innerHTML = data.stats.map(function (s) {
    return '<li><b><span data-count="' + s.value + '">0</span><small>' + s.unit + '</small></b>' + s.label + '</li>';
  }).join('');

  listEl.innerHTML = data.points.map(function (p, i) {
    return '<article class="acard reveal" data-delay="' + Math.min(i, 3) + '">' +
      '<div class="acard__pic" style="--x:' + p.x + '%;--y:' + p.y + '%;--z:' + p.z + '">' +
        '<img src="' + data.img + '" alt="" loading="lazy" decoding="async">' +
        (p.z > 1 ? '<i class="acard__ring" aria-hidden="true"></i>' : '') +
        '<span class="acard__chip">' + p.chip + '</span><b class="acard__no">' + pad(i + 1) + '</b>' +
      '</div>' +
      '<div class="acard__body"><h3>' + p.title + '</h3>' + WAVE + '<p>' + p.text + '</p></div>' +
    '</article>';
  }).join('');

  if (window.TeswayCount) window.TeswayCount(statsEl, 100);
})();
