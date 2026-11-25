/* ==== notice-data.js ==== */
window.TESWAY_NOTICE = {
  deadline: (function () {
    var now = new Date();
    var end = new Date(now.getFullYear(), 10, 30, 23, 59, 59);
    if (end < now) end.setFullYear(end.getFullYear() + 1);
    return end.toISOString();
  })(),
  interval: 5000,
  slides: [
    {
      html: '<b>Black Friday</b> ends in',
      countdown: true,
      link: { href: '#hot', text: 'Shop now' }
    },
    {
      html: '<b>Free shipping</b> &amp; 2-year warranty on every TESWAY'
    },
    {
      html: 'Book a <b>free test ride</b> this weekend',
      link: { href: '#hot', text: 'Book now' }
    }
  ]
};

/* ==== flip.js ==== */
window.TeswayFlip = (function () {
  var HALVES = ['flip__top', 'flip__bottom', 'flip__top flip__leaf', 'flip__bottom flip__leaf'];

  function digit() {
    var el = document.createElement('span');
    el.className = 'flip';
    el.innerHTML = HALVES.map(function (c) {
      return '<span class="flip__half ' + c + '"><i>0</i></span>';
    }).join('');
    var parts = el.querySelectorAll('i');
    var state = { el: el, value: '0', top: parts[0], bottom: parts[1], leafTop: parts[2], leafBottom: parts[3] };
    return state;
  }

  function set(d, v) {
    if (d.value === v) return;
    var old = d.value;
    d.value = v;
    d.top.textContent = v;
    d.bottom.textContent = old;
    d.leafTop.textContent = old;
    d.leafBottom.textContent = v;
    clearTimeout(d.timer);
    d.el.classList.remove('go');
    void d.el.offsetWidth;
    d.el.classList.add('go');
    d.timer = setTimeout(function () {
      d.bottom.textContent = v;
      d.leafTop.textContent = v;
      d.el.classList.remove('go');
    }, 540);
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function mount(root, deadline, labels) {
    var end = new Date(deadline).getTime();
    var digits = [];
    ['days', 'hours', 'minutes', 'seconds'].forEach(function (unit, i) {
      if (i) {
        var sep = document.createElement('span');
        sep.className = 'flip-sep';
        sep.textContent = ':';
        root.appendChild(sep);
      }
      var group = document.createElement('span');
      group.className = 'flip-group';
      group.setAttribute('aria-hidden', 'true');
      for (var k = 0; k < 2; k++) {
        var d = digit();
        digits.push(d);
        group.appendChild(d.el);
      }
      if (!labels) return root.appendChild(group);
      var wrap = document.createElement('span');
      wrap.className = 'flip-unit';
      wrap.appendChild(group);
      wrap.insertAdjacentHTML('beforeend', '<small>' + labels[i] + '</small>');
      root.appendChild(wrap);
    });

    function tick() {
      var left = Math.max(0, Math.floor((end - Date.now()) / 1000));
      var str = pad(Math.min(99, Math.floor(left / 86400))) + pad(Math.floor(left / 3600) % 24) +
        pad(Math.floor(left / 60) % 60) + pad(left % 60);
      digits.forEach(function (d, i) { set(d, str[i]); });
      root.setAttribute('aria-label', str.slice(0, 2) + ' days ' + str.slice(2, 4) + ' hours ' +
        str.slice(4, 6) + ' minutes left');
      if (left > 0) setTimeout(tick, 1000 - (Date.now() % 1000));
    }
    tick();
  }

  return { mount: mount };
})();

/* ==== notice.js ==== */
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
    '<button class="arw notice__arrow" data-dir="-1" aria-label="Previous notice"><span>‹</span></button>' +
    '<div class="notice__track" aria-live="polite">' + slidesHtml + '</div>' +
    '<button class="arw notice__arrow" data-dir="1" aria-label="Next notice"><span>›</span></button>';

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
