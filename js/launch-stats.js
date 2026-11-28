/* ==== launch-stats.js · pinned gauge: one headline number per scroll step ==== */
(function () {
  var K = window.TeswayPDP, L = window.TESWAY_LAUNCH, S = window.TeswayScrub;
  var box = document.getElementById('lstBox');
  if (!K || !L || !S || !box) return;
  var sec = box.parentNode;
  var stats = L.stats.map(function (s) {
    return { v: K.p[s.key] != null ? K.p[s.key] : K.x[s.key], unit: s.unit, label: s.label, max: s.max };
  });
  var n = stats.length;
  var pad = function (i) { return (i < 9 ? '0' : '') + (i + 1); };

  var ticks = '';
  for (var t = 0; t <= 20; t++) {
    var a = Math.PI * (1 + t / 20), r1 = t % 5 ? 90 : 86;
    ticks += '<path d="M' + (100 + Math.cos(a) * r1).toFixed(1) + ' ' + (110 + Math.sin(a) * r1).toFixed(1) +
      'L' + (100 + Math.cos(a) * 95).toFixed(1) + ' ' + (110 + Math.sin(a) * 95).toFixed(1) + '"/>';
  }
  var arc = 'M20 110A80 80 0 0 1 180 110';

  box.innerHTML =
    '<header class="lst__head"><p class="eyebrow">By the numbers</p><p class="lst__count"><b>01</b> / ' + pad(n - 1) + '</p></header>' +
    '<p class="lst__ghost" aria-hidden="true">01</p>' +
    '<div class="lst__gauge">' +
      '<svg viewBox="0 0 200 118" aria-hidden="true"><g class="lst__ticks">' + ticks + '</g>' +
        '<path class="lst__track" d="' + arc + '" pathLength="1"/><path class="lst__fill" d="' + arc + '" pathLength="1"/></svg>' +
      '<p class="lst__read"><b class="lst__num">0</b><span class="lst__unit">' + stats[0].unit + '</span></p>' +
    '</div>' +
    '<p class="lst__label">' + stats[0].label + '</p>' +
    '<ol class="lst__list">' + stats.map(function (s, i) {
      return '<li style="--i:' + i + '"><span>' + s.unit + '</span><i></i></li>';
    }).join('') + '</ol>';

  var num = box.querySelector('.lst__num'), unit = box.querySelector('.lst__unit');
  var label = box.querySelector('.lst__label'), count = box.querySelector('.lst__count b');
  var ghost = box.querySelector('.lst__ghost');
  var cur = -1;

  function swap(el, text) {
    el.textContent = text;
    el.classList.remove('is-swap');
    void el.offsetWidth;
    el.classList.add('is-swap');
  }

  S.on(sec, function (p) {
    var f = Math.min(n - 0.0001, p * n);
    var i = Math.floor(f), s = stats[i];
    var e = 1 - Math.pow(1 - Math.min(1, (f - i) / 0.55), 3);
    if (i !== cur) {
      cur = i;
      swap(unit, s.unit);
      swap(label, s.label);
      count.textContent = pad(i);
      ghost.textContent = pad(i);
      sec.dataset.step = i;
    }
    num.textContent = Math.round(s.v * e);
    box.style.setProperty('--g', (s.v / s.max * e).toFixed(4));
    box.style.setProperty('--f', f.toFixed(4));
  });
})();
