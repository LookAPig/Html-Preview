(function () {
  var root = document.getElementById('notice');
  var cfg = window.TESWAY_NOTICE;
  if (!root || !cfg) return;

  var slidesHtml = cfg.slides.map(function (s) {
    return '<div class="notice__slide' + (s.countdown ? ' notice__slide--cd' : '') + '">' +
      '<span>' + s.html + '</span>' +
      (s.countdown ? '<span class="notice__cd" role="timer"></span>' : '') +
      (s.link ? '<a class="notice__link" href="' + s.link.href + '">' + s.link.text + ' →</a>' : '') +
      '</div>';
  }).join('');

  root.innerHTML =
    '<button class="notice__arrow" data-dir="-1" aria-label="Previous notice">‹</button>' +
    '<div class="notice__track" aria-live="polite">' + slidesHtml + '</div>' +
    '<button class="notice__arrow" data-dir="1" aria-label="Next notice">›</button>';

  var slides = root.querySelectorAll('.notice__slide');
  var cd = root.querySelector('.notice__cd');
  var index = 0, timer = null, paused = false;

  if (cd && window.TeswayFlip) window.TeswayFlip.mount(cd, cfg.deadline);

  function show(next, dir) {
    var prev = slides[index];
    index = (next + slides.length) % slides.length;
    var cur = slides[index];
    if (prev === cur) return;
    slides.forEach(function (s) { s.classList.remove('is-on', 'is-out', 'from-top'); });
    if (dir < 0) cur.classList.add('from-top');
    void cur.offsetWidth;
    cur.classList.remove('from-top');
    cur.classList.add('is-on');
    if (dir > 0) prev.classList.add('is-out');
    restart();
  }

  function restart() {
    clearTimeout(timer);
    if (paused || slides.length < 2) return;
    timer = setTimeout(function () { show(index + 1, 1); }, cfg.interval);
  }

  function pause(on) {
    paused = on;
    restart();
  }

  root.querySelectorAll('.notice__arrow').forEach(function (b) {
    b.addEventListener('click', function () { show(index + +b.dataset.dir, +b.dataset.dir); });
  });
  root.addEventListener('mouseenter', function () { pause(true); });
  root.addEventListener('mouseleave', function () { pause(false); });
  document.addEventListener('visibilitychange', function () { pause(document.hidden); });

  var startX = null;
  root.addEventListener('pointerdown', function (e) { startX = e.clientX; });
  root.addEventListener('pointerup', function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });

  slides[0].classList.add('is-on');
  restart();
})();
