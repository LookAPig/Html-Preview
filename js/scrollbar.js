(function () {
  var doc = document.documentElement;
  var bar = document.createElement('div');
  bar.className = 'sbar';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<i class="sbar__thumb"></i>';
  document.body.appendChild(bar);
  var thumb = bar.firstChild;

  var IDLE = 900;
  var pad = 0, track = 0, size = 0, max = 0, timer = 0, ticking = false, drag = null;

  function measure() {
    pad = parseFloat(getComputedStyle(doc).fontSize) * .375;
    var vh = window.innerHeight;
    max = doc.scrollHeight - vh;
    track = vh - pad * 2;
    size = Math.max(pad * 8, track * vh / doc.scrollHeight);
    thumb.style.height = size + 'px';
    bar.classList.toggle('is-none', max <= 1);
    place();
  }

  function place() {
    ticking = false;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    thumb.style.transform = 'translate3d(0,' + (pad + p * (track - size)).toFixed(1) + 'px,0)';
  }

  function show() {
    bar.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(function () { bar.classList.remove('is-on'); }, IDLE);
  }

  function jump(y, smooth) {
    window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'instant' });
  }

  window.addEventListener('scroll', function () {
    show();
    if (!ticking) { ticking = true; requestAnimationFrame(place); }
  }, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(document.body);

  thumb.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    drag = { y: e.clientY, top: window.scrollY };
    thumb.setPointerCapture(e.pointerId);
    bar.classList.add('is-drag');
  });
  thumb.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var span = track - size;
    if (span > 0) jump(drag.top + (e.clientY - drag.y) * max / span, false);
  });
  function stop() {
    if (!drag) return;
    drag = null;
    bar.classList.remove('is-drag');
    show();
  }
  thumb.addEventListener('pointerup', stop);
  thumb.addEventListener('pointercancel', stop);

  bar.addEventListener('pointerdown', function (e) {
    if (e.target !== bar || e.button !== 0) return;
    var span = track - size;
    if (span > 0) jump((e.clientY - pad - size / 2) / span * max, true);
  });

  measure();
})();
