/* ==== about-time.js · sticky scroll story: scroll drives the bike along the road ==== */
(function () {
  var sec = document.getElementById('story');
  var cv = document.getElementById('timeCanvas');
  var copy = document.getElementById('timeCopy');
  var pic = document.getElementById('timePic');
  var rail = document.getElementById('timeRail');
  var list = window.TESWAY_ABOUT && window.TESWAY_ABOUT.time;
  if (!sec || !cv || !list || !window.TeswayScene) return;

  var n = list.length;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scene = window.TeswayScene(cv);
  var years = list.map(function (t) { return t.year; });
  var seg = 0, marks = [], D = 0, goal = 0, idx = -1, raf = 0, on = false, busy = true;
  var IN = 0.04, SPAN = 0.88;

  pic.innerHTML = list.map(function (t) { return '<img src="' + t.img + '" alt="' + t.title + '" loading="lazy" decoding="async">'; }).join('');
  rail.innerHTML = '<li class="atime__fill" aria-hidden="true"><i></i></li>' + list.map(function (t, i) {
    return '<li><button type="button" data-i="' + i + '" aria-label="' + t.year + ': ' + t.title + '"><i></i><span>' + t.year + '</span></button></li>';
  }).join('');
  var imgs = Array.prototype.slice.call(pic.children);
  var dots = Array.prototype.slice.call(rail.querySelectorAll('button'));
  var fill = rail.querySelector('.atime__fill i');

  function layout() {
    var r = scene.resize();
    seg = r.w * (r.w < cv.clientHeight ? 0.66 : 0.5);
    marks = list.map(function (_, i) { return r.bx + r.off + i * seg; });
    measure();
    D = goal;
    busy = true;
  }

  function measure() {
    var r = sec.getBoundingClientRect();
    var p = Math.max(0, Math.min(1, -r.top / (r.height - innerHeight)));
    goal = seg * (n - 1) * Math.max(0, Math.min(1, (p - IN) / SPAN));
  }

  function show(i) {
    if (i === idx) return;
    var t = list[i];
    idx = i;
    copy.innerHTML = '<p class="atime__yr">' + t.year + '</p><h3>' + t.title + '</h3><p class="atime__txt">' + t.text + '</p>' +
      '<p class="atime__no">' + String(i + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0') + '</p>';
    copy.classList.remove('is-swap');
    void copy.offsetWidth;
    copy.classList.add('is-swap');
    imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === i); });
    dots.forEach(function (d, k) {
      d.classList.toggle('is-on', k === i);
      d.classList.toggle('is-past', k <= i);
      d.setAttribute('aria-current', k === i ? 'step' : 'false');
    });
  }

  function frame() {
    var prev = D;
    D += (goal - D) * (calm ? 1 : 0.09);
    if (Math.abs(goal - D) < 0.05) D = goal;
    var v = D - prev;
    if (busy || v !== 0) {
      var p = D / (seg * (n - 1) || 1), i = Math.max(0, Math.min(n - 1, Math.round(D / seg)));
      busy = scene.draw({
        D: D, v: v, marks: marks, years: years, idx: i,
        solid: Math.max(0, Math.min(1, (D - seg * 0.45) / (seg * 0.5))),
        motors: D >= seg * 1.92
      });
      fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      show(i);
    }
    if (on) raf = requestAnimationFrame(frame);
  }

  rail.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var top = sec.getBoundingClientRect().top + scrollY;
    var p = IN + SPAN * Number(b.dataset.i) / (n - 1);
    scrollTo({ top: top + p * (sec.offsetHeight - innerHeight) + 2, behavior: calm ? 'auto' : 'smooth' });
  });

  addEventListener('scroll', measure, { passive: true });
  var rt = 0;
  addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { busy = true; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      on = es[0].isIntersecting;
      cancelAnimationFrame(raf);
      if (on) { busy = true; raf = requestAnimationFrame(frame); }
    }).observe(sec);
  } else { on = true; raf = requestAnimationFrame(frame); }

  layout();
  show(0);
  if (!on) { busy = true; frame(); }
})();
