/* ==== about-hero.js · count-up helper + hero video ==== */
(function () {
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function run(el, delay) {
    var to = Number(el.dataset.count), suffix = el.dataset.suffix || '';
    if (calm) { el.textContent = to + suffix; return; }
    var t0 = 0, dur = 1600;
    setTimeout(function () {
      requestAnimationFrame(function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      });
    }, delay || 0);
  }

  window.TeswayCount = function (root, delay) {
    if (!root || root.dataset.counted) return;
    root.dataset.counted = '1';
    root.querySelectorAll('[data-count]').forEach(function (el, i) { run(el, (delay || 0) + i * 120); });
  };

  window.TeswayOnScene = function (id, fn) {
    document.addEventListener('ascene', function (e) { if (e.detail.id === id) fn(e.detail.on); });
  };

  window.TeswayCount(document.getElementById('heroStats'), 900);
  window.TeswayOnScene('map', function (on) { if (on) window.TeswayCount(document.getElementById('mapStats'), 200); });
})();
