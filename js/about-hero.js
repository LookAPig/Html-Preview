/* ==== about-hero.js · count-up helper + hero video / parallax ==== */
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
    var els = Array.prototype.slice.call(root.querySelectorAll('[data-count]'));
    if (!('IntersectionObserver' in window)) return els.forEach(function (el) { run(el); });
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      els.forEach(function (el, i) { run(el, (delay || 0) + i * 120); });
    }, { threshold: 0.4 });
    io.observe(root);
  };

  var hero = document.getElementById('top');
  if (!hero) return;
  window.TeswayCount(document.getElementById('heroStats'), 900);

  var video = hero.querySelector('video');
  var desktop = matchMedia('(min-aspect-ratio: 1/1)');
  var off = false;
  function sync() {
    if (!video || calm || !desktop.matches) return;
    if (!video.src) {
      video.src = video.dataset.src;
      video.addEventListener('playing', function () { video.classList.add('is-playing'); });
    }
    if (off) video.pause(); else video.play().catch(function () {});
  }
  setTimeout(sync, 1200);
  desktop.addEventListener('change', sync);

  var ticking = false;
  function render() {
    ticking = false;
    var h = hero.offsetHeight, y = Math.min(scrollY, h);
    if (!calm) {
      hero.style.setProperty('--py', (y * 0.35).toFixed(1) + 'px');
      hero.style.setProperty('--fade', (1 - y / (h * 0.8)).toFixed(3));
    }
    var o = y > h * 0.6;
    if (o !== off) { off = o; if (video && video.src) sync(); }
  }
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(render); }
  }, { passive: true });
})();
