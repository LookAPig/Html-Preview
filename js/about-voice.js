/* ==== about-voice.js · infinite photo review marquee (drag + inertia) ==== */
(function () {
  var rowsBox = document.getElementById('voiceRows');
  var scoreBox = document.getElementById('voiceScore');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.voice;
  if (!rowsBox || !data) return;

  var STAR = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.2l2 4.3 4.7.5-3.5 3.2 1 4.6L8 11.5l-4.2 2.3 1-4.6L1.3 6l4.7-.5z"/></svg>';
  var stars = '<span class="avoice__stars">' + new Array(6).join(STAR) + '</span>';

  if (scoreBox) {
    scoreBox.innerHTML = '<b>' + data.score.toFixed(1) + '</b><span>' + stars +
      '<small>' + data.count + ' verified reviews</small><small>' + data.sources.join(' · ') + '</small></span>';
  }

  function card(r) {
    return '<article class="avoice__card">' +
      '<figure><img src="' + r.img + '" alt="" loading="lazy" decoding="async" draggable="false"><figcaption>' + r.bike + '</figcaption></figure>' +
      '<div class="avoice__body">' + stars + '<h3>' + r.title + '</h3><p>' + r.text + '</p>' +
      '<footer><b>' + r.name + '</b><small>' + r.from + '</small></footer></div></article>';
  }

  var all = data.reviews, half = Math.ceil(all.length / 2);
  var sets = [all.slice(0, half), all.slice(half)];
  rowsBox.innerHTML = sets.map(function (set, i) {
    var cards = set.concat(set).map(card).join('');
    return '<div class="avoice__row" data-dir="' + (i ? 1 : -1) + '"><div class="avoice__belt">' +
      '<div class="avoice__set">' + cards + '</div><div class="avoice__set" aria-hidden="true">' + cards + '</div></div></div>';
  }).join('');

  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rows = Array.prototype.map.call(rowsBox.querySelectorAll('.avoice__row'), function (el) {
    return { el: el, belt: el.firstChild, dir: Number(el.dataset.dir), x: 0, v: 0, hold: false, hover: false, w: 0, lastX: 0, lastT: 0, moved: 0 };
  });
  var BASE = 30, running = false, last = 0;

  function measure() { rows.forEach(function (r) { r.w = r.belt.firstChild.offsetWidth; }); }

  function wrap(r) {
    if (!r.w) return;
    r.x = ((r.x % r.w) + r.w) % r.w;
    r.belt.style.transform = 'translate3d(' + (-r.x).toFixed(2) + 'px,0,0)';
  }

  function frame(t) {
    var dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
    last = t;
    rows.forEach(function (r) {
      if (r.hold) return;
      var goal = calm ? 0 : BASE * -r.dir * (r.hover ? 0.15 : 1);
      r.v += (goal - r.v) * Math.min(1, dt * (Math.abs(r.v) > BASE * 1.5 ? 2.2 : 4));
      r.x += r.v * dt;
      wrap(r);
    });
    if (running) requestAnimationFrame(frame);
  }

  function start() { if (!running) { running = true; last = 0; requestAnimationFrame(frame); } }

  rows.forEach(function (r) {
    var el = r.el;
    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') r.hover = true; });
    el.addEventListener('pointerleave', function () { r.hover = false; });
    el.addEventListener('pointerdown', function (e) {
      r.hold = true; r.moved = 0; r.v = 0;
      r.lastX = e.clientX; r.lastT = performance.now();
      el.classList.add('is-drag');
    });
    el.addEventListener('pointermove', function (e) {
      if (!r.hold) return;
      var now = performance.now(), dx = e.clientX - r.lastX;
      if (Math.abs(dx) > 2 && !el.hasPointerCapture(e.pointerId)) el.setPointerCapture(e.pointerId);
      r.x -= dx; r.moved += Math.abs(dx);
      r.v = -dx / Math.max(0.008, (now - r.lastT) / 1000);
      r.lastX = e.clientX; r.lastT = now;
      wrap(r);
    });
    function release() {
      if (!r.hold) return;
      r.hold = false;
      r.v = Math.max(-2400, Math.min(2400, r.v));
      el.classList.remove('is-drag');
    }
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('click', function (e) { if (r.moved > 6) e.preventDefault(); }, true);
  });

  measure();
  addEventListener('resize', measure);
  addEventListener('load', measure);
  window.TeswayOnScene('voice', function (on) { if (on) { measure(); start(); } else running = false; });
})();
