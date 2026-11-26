/* ==== about-voice.js ==== */
(function () {
  var rowsBox = document.getElementById('voiceRows');
  var scoreBox = document.getElementById('voiceScore');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.voice;
  if (!rowsBox || !scoreBox || !data) return;

  var STAR = '<path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/>';
  function stars(cls) {
    var one = '<svg viewBox="0 0 24 24" aria-hidden="true">' + STAR + '</svg>';
    return '<span class="' + cls + '">' + one + one + one + one + one + '</span>';
  }
  function initials(n) { return n.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2); }

  scoreBox.innerHTML =
    '<p class="abv__num"><b data-count="' + data.score + '" data-dec="1" data-from="3">' + data.score + '</b><span>/ 5</span></p>' +
    '<div class="abv__rate" style="--rate:' + (data.score / 5) + '" role="img" aria-label="Rated ' + data.score + ' out of 5">' +
      stars('abv__base') + stars('abv__fill') + '</div>' +
    '<p class="abv__count">From <b>' + data.count + '</b> verified reviews</p>' +
    '<ul class="abv__src">' + data.sources.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>';

  function card(r, k) {
    return '<article class="abv__card" style="--k:' + k + '">' +
      '<div class="abv__meta">' + stars('abv__mini') + '<span class="abv__ok">Verified</span></div>' +
      '<h3>' + r.title + '</h3><p>' + r.text + '</p>' +
      '<footer><i class="abv__ava">' + initials(r.name) + '</i><span><b>' + r.name + '</b><small>' + r.from + ' · ' + r.bike + '</small></span></footer>' +
      '</article>';
  }

  var all = data.reviews;
  var half = Math.ceil(all.length / 2);
  var sets = [all, all.slice(half).concat(all.slice(0, half))];
  rowsBox.innerHTML = sets.map(function (set, i) {
    var cards = set.map(card).join('');
    return '<div class="abv__row" data-dir="' + (i ? 1 : -1) + '"><div class="abv__belt">' +
      '<div class="abv__set">' + cards + '</div><div class="abv__set" aria-hidden="true">' + cards + '</div></div></div>';
  }).join('');
  if (window.TeswayCount) window.TeswayCount.watch(scoreBox);

  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rows = Array.prototype.map.call(rowsBox.querySelectorAll('.abv__row'), function (el) {
    return { el: el, belt: el.firstChild, dir: Number(el.dataset.dir), x: 0, v: 0, hold: false, hover: false, w: 0, lastX: 0, lastT: 0, moved: 0 };
  });
  var BASE = 34, running = false, last = 0;

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
      var goal = calm || r.hover ? 0 : BASE * -r.dir;
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
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) start(); else running = false;
    }).observe(rowsBox);
  } else start();
})();
