/* ==== about-fx.js · count-up + hero parallax ==== */
(function () {
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fmt(el, v) {
    var dec = Number(el.dataset.dec || 0);
    var n = dec ? v.toFixed(dec) : Math.round(v);
    if (!('plain' in el.dataset) && !dec) n = Number(n).toLocaleString('en-US');
    return (el.dataset.prefix || '') + n + (el.dataset.suffix || '');
  }

  function run(el) {
    var to = Number(el.dataset.count);
    var from = Number(el.dataset.from || 0);
    var dur = Number(el.dataset.dur || 1600);
    var t0 = 0;
    if (calm) { el.textContent = fmt(el, to); return; }
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      el.textContent = fmt(el, from + (to - from) * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    }
    el.textContent = fmt(el, from);
    requestAnimationFrame(tick);
  }

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (list) {
    list.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      setTimeout(function () { run(e.target); }, Number(e.target.dataset.wait || 0));
    });
  }, { threshold: 0.6 }) : null;

  function watch(root) {
    (root || document).querySelectorAll('[data-count]').forEach(function (el) {
      if (io) io.observe(el); else run(el);
    });
  }
  window.TeswayCount = { watch: watch };
  watch(document.querySelector('.abh'));

  var hero = document.querySelector('.abh');
  if (!hero || calm) return;
  var ticking = false;
  function paint() {
    ticking = false;
    var h = hero.offsetHeight;
    var y = Math.min(window.scrollY, h);
    hero.style.setProperty('--hy', (y * 0.3).toFixed(1) + 'px');
    hero.style.setProperty('--hf', (1 - y / h * 1.4).toFixed(3));
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(paint); }
  }, { passive: true });
  paint();

  if (!matchMedia('(hover: hover)').matches) return;
  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
  hero.addEventListener('pointerleave', function () {
    hero.style.setProperty('--mx', 0);
    hero.style.setProperty('--my', 0);
  });
})();
