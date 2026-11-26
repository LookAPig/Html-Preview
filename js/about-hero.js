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

  var hero = document.getElementById('top');
  if (!hero) return;
  window.TeswayCount(document.getElementById('heroStats'), 900);

  var video = hero.querySelector('video');
  var desktop = matchMedia('(min-aspect-ratio: 1/1)');
  var on = true;
  function sync() {
    if (!video || calm || !desktop.matches) return;
    if (!video.src) {
      if (!on) return;
      video.src = video.dataset.src;
      video.addEventListener('playing', function () { video.classList.add('is-playing'); });
    }
    if (on) video.play().catch(function () {}); else video.pause();
  }
  setTimeout(sync, 1200);
  desktop.addEventListener('change', sync);
  window.TeswayOnScene('hero', function (v) { on = v; sync(); });
})();
