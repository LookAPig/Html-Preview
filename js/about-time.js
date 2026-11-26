/* ==== about-time.js · bike rides an SVG path between milestones ==== */
(function () {
  var box = document.getElementById('timeBox');
  var list = window.TESWAY_ABOUT && window.TESWAY_ABOUT.time;
  if (!box || !list) return;

  var n = list.length;
  var STEP = 4500;
  var pc = matchMedia('(min-aspect-ratio: 1/1)');
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROADS = {
    pc: { w: 1200, h: 90, bike: 1.35, d: 'M12 58C170 58 230 28 380 30S640 66 800 60 1040 26 1188 34' },
    m: { w: 360, h: 72, bike: 0.95, d: 'M8 48C60 48 80 24 130 26S210 54 260 50 330 28 352 32' }
  };
  var WHEEL = '<g class="abt__wheel"><circle r="7"/><path d="M0-7v14M-7 0h14"/></g>';
  var BIKE = '<g class="abt__bike"><g class="abt__rig">' +
    '<g transform="translate(-11 -7)">' + WHEEL + '</g><g transform="translate(11 -7)">' + WHEEL + '</g>' +
    '<path class="abt__frame" d="M-11-7H-1L-5-17ZM-5-17 6-18M6-18 11-7M5-21 6-18M3.5-21.5H8M-7.5-18H-2.5"/>' +
    '<path class="abt__batt" d="M-1-7 6-18"/></g></g>';
  var arrow = function (d) { return '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; };

  box.innerHTML = '<div class="abt__road"></div>' +
    '<div class="abt__body"><figure class="abt__img"><img alt="" decoding="async"></figure>' +
    '<div class="abt__txt"><div class="abt__copy" aria-live="polite"></div>' +
    '<div class="abt__nav"><button class="arw" type="button" data-dir="-1" aria-label="Previous milestone">' + arrow('M13 8H3M7 4 3 8l4 4') + '</button>' +
    '<button class="arw" type="button" data-dir="1" aria-label="Next milestone">' + arrow('M3 8h10M9 4l4 4-4 4') + '</button></div></div></div>';

  var road = box.querySelector('.abt__road');
  var img = box.querySelector('.abt__img img');
  var copy = box.querySelector('.abt__copy');
  var arrows = box.querySelectorAll('.arw');
  var cfg, path, trail, bike, rig, wheels, years = [], len = 0;
  var at = 0, l = 0, raf = 0, timer = 0, auto = true, seen = false;
  list.forEach(function (t) { new Image().src = t.img; });

  function nodeLen(i) { return len * (0.04 + 0.92 * i / (n - 1)); }

  function build() {
    cfg = pc.matches ? ROADS.pc : ROADS.m;
    road.innerHTML = '<svg viewBox="0 0 ' + cfg.w + ' ' + cfg.h + '" aria-hidden="true">' +
      '<path class="abt__line" d="' + cfg.d + '"/><path class="abt__trail" d="' + cfg.d + '"/>' + BIKE + '</svg><ol class="abt__years"></ol>';
    path = road.querySelector('.abt__line');
    trail = road.querySelector('.abt__trail');
    bike = road.querySelector('.abt__bike');
    rig = road.querySelector('.abt__rig');
    wheels = road.querySelectorAll('.abt__wheel');
    len = path.getTotalLength();
    trail.style.strokeDasharray = len;
    rig.setAttribute('transform', 'scale(' + cfg.bike + ')');
    road.querySelector('.abt__years').innerHTML = list.map(function (t, i) {
      var p = path.getPointAtLength(nodeLen(i));
      return '<li style="left:' + (p.x / cfg.w * 100).toFixed(2) + '%;top:' + (p.y / cfg.h * 100).toFixed(2) + '%">' +
        '<button class="abt__yr" type="button" data-i="' + i + '" aria-label="' + t.year + ': ' + t.title + '"><i></i><span>' + t.year + '</span></button></li>';
    }).join('');
    years = Array.prototype.slice.call(road.querySelectorAll('.abt__yr'));
    l = nodeLen(at);
    place(1);
  }

  function place(dir) {
    var p = path.getPointAtLength(l);
    var a = path.getPointAtLength(Math.max(0, l - 2)), b = path.getPointAtLength(Math.min(len, l + 2));
    var deg = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    bike.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ') rotate(' + deg.toFixed(2) + ') scale(' + dir + ' 1)');
    var spin = (l / (7 * cfg.bike) * 57.3 * dir).toFixed(1);
    Array.prototype.forEach.call(wheels, function (w) { w.setAttribute('transform', 'rotate(' + spin + ')'); });
    trail.style.strokeDashoffset = (len - l).toFixed(1);
    years.forEach(function (y, i) { y.classList.toggle('is-past', nodeLen(i) <= l + 0.5); });
  }

  function show(i) {
    var t = list[i];
    years.forEach(function (y, k) { y.classList.toggle('is-on', k === i); y.setAttribute('aria-current', k === i ? 'step' : 'false'); });
    img.src = t.img;
    copy.innerHTML = '<b class="abt__y">' + t.year + '</b><h3>' + t.title + '</h3><p>' + t.text + '</p>';
    box.classList.remove('is-swap');
    void box.offsetWidth;
    box.classList.add('is-swap');
    arrows[0].disabled = i === 0;
    arrows[1].disabled = i === n - 1;
  }

  function ride(i) {
    cancelAnimationFrame(raf);
    at = i;
    show(i);
    var from = l, to = nodeLen(i), dir = to < from ? -1 : 1;
    var dur = calm ? 0 : 500 + 1100 * Math.abs(to - from) / len, t0 = 0;
    function step(t) {
      if (!t0) t0 = t;
      var p = dur ? Math.min(1, (t - t0) / dur) : 1;
      var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      l = from + (to - from) * e;
      place(dir);
      if (p < 1) raf = requestAnimationFrame(step);
      else { place(1); schedule(); }
    }
    raf = requestAnimationFrame(step);
  }

  function schedule(wait) {
    clearTimeout(timer);
    if (auto && seen && !calm) timer = setTimeout(function () { ride((at + 1) % n); }, wait || STEP);
  }
  function pick(i) { auto = false; clearTimeout(timer); if (i !== at) ride(i); }

  road.addEventListener('click', function (e) { var y = e.target.closest('.abt__yr'); if (y) pick(Number(y.dataset.i)); });
  arrows.forEach(function (b) { b.addEventListener('click', function () { pick(Math.max(0, Math.min(n - 1, at + Number(b.dataset.dir)))); }); });
  pc.addEventListener('change', build);
  addEventListener('resize', function () { if (path) place(1); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      seen = es[0].isIntersecting;
      if (seen) schedule(at === 0 ? 1600 : STEP); else clearTimeout(timer);
    }, { threshold: 0.5 }).observe(box);
  }
  build();
  show(0);
})();
