/* ==== about-time.js · scroll-driven bike ride along an SVG road ==== */
(function () {
  var road = document.getElementById('timeRoad');
  var card = document.getElementById('timeCard');
  var list = window.TESWAY_ABOUT && window.TESWAY_ABOUT.time;
  if (!road || !card || !list) return;

  var sec = road.closest('.abt');
  var n = list.length;
  var pc = matchMedia('(min-aspect-ratio: 1/1)');
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROADS = {
    pc: { w: 1200, h: 200, bike: 2.1, font: 24, gap: [-24, 44], d: 'M40 140C160 140 200 50 330 50S520 160 640 150 850 40 960 50 1120 140 1160 130' },
    m: { w: 360, h: 210, bike: 1.05, font: 15, gap: [-17, 31], d: 'M22 150C62 150 70 62 120 62S180 160 226 150 292 56 340 72' }
  };
  var WHEEL = '<g class="abt__wheel"><circle r="7"/><path d="M0-7v14M-7 0h14M-5-5l10 10M5-5-5 5"/></g>';
  var BIKE = '<g class="abt__bike"><g class="abt__rig">' +
    '<g transform="translate(-11 -7)">' + WHEEL + '</g><g transform="translate(11 -7)">' + WHEEL + '</g>' +
    '<path class="abt__frame" d="M-11-7H-1L-5-17ZM-5-17 6-18M6-18 11-7M5-21 6-18M3.5-21.5H8M-7.5-18H-2.5"/>' +
    '<path class="abt__batt" d="M-1-7 6-18"/>' +
    '<path class="abt__rider" d="M-5-18.5-.5-28M-.5-28 5.5-21.5M-5-18.5 3-14-1-7"/><circle class="abt__head" cx="1" cy="-31.5" r="2.6"/></g></g>';
  var cfg, path, len, marks, bike, rig, wheels, trail, nodes = [];
  var travel = 1, target = 0, cur = -1, at = -1, ticking = false;

  function pad(v) { return String(v).padStart(2, '0'); }
  function nodeLen(i) { return len * (0.03 + 0.94 * i / (n - 1)); }

  function build() {
    cfg = pc.matches ? ROADS.pc : ROADS.m;
    road.innerHTML = '<svg viewBox="0 0 ' + cfg.w + ' ' + cfg.h + '" role="group" aria-label="TESWAY timeline">' +
      '<path class="abt__base" d="' + cfg.d + '"/><path class="abt__lane" d="' + cfg.d + '"/>' +
      '<path class="abt__trail" d="' + cfg.d + '"/><g class="abt__nodes"></g>' + BIKE + '</svg>';
    path = road.querySelector('.abt__base');
    len = path.getTotalLength();
    trail = road.querySelector('.abt__trail');
    trail.style.strokeDasharray = len;
    bike = road.querySelector('.abt__bike');
    rig = road.querySelector('.abt__rig');
    rig.setAttribute('transform', 'scale(' + cfg.bike + ')');
    wheels = road.querySelectorAll('.abt__wheel');
    marks = road.querySelector('.abt__nodes');
    var mid = cfg.h * 0.5;
    marks.innerHTML = list.map(function (t, i) {
      var p = path.getPointAtLength(nodeLen(i));
      var dy = p.y < mid ? cfg.gap[0] : cfg.gap[1];
      return '<g class="abt__node" transform="translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')" data-i="' + i + '" tabindex="0" role="button" aria-label="' + t.year + ': ' + t.title + '">' +
        '<circle class="abt__ring" r="11"/><circle class="abt__core" r="4"/>' +
        '<text y="' + dy + '" style="font-size:' + cfg.font + 'px">' + t.year + '</text></g>';
    }).join('');
    nodes = Array.prototype.slice.call(marks.children);
    at = -1;
    paint(cur < 0 ? 0 : cur);
  }

  card.innerHTML = '<div class="abt__slide"></div>' +
    '<div class="abt__ctrl"><b class="abt__now">01</b><span class="abt__bar"><i></i></span><small>' + pad(n) + '</small>' +
    '<div class="abt__arrows"><button class="arw" type="button" data-dir="-1" aria-label="Previous milestone"><span>&#8592;</span></button>' +
    '<button class="arw" type="button" data-dir="1" aria-label="Next milestone"><span>&#8594;</span></button></div></div>';
  var slide = card.firstChild;
  var nowEl = card.querySelector('.abt__now');
  var barEl = card.querySelector('.abt__bar i');
  var arrows = card.querySelectorAll('.arw');
  list.forEach(function (t) { new Image().src = t.img; });

  function setCard(i) {
    var dir = i > at ? 1 : -1, t = list[i];
    at = i;
    nodes.forEach(function (g, k) { g.classList.toggle('is-past', k <= i); g.classList.toggle('is-now', k === i); });
    slide.innerHTML = '<figure class="abt__img"><img src="' + t.img + '" alt="" decoding="async"></figure>' +
      '<div class="abt__txt"><b class="abt__y">' + t.year + '</b><h3>' + t.title + '</h3><p>' + t.text + '</p></div>';
    slide.style.setProperty('--dir', dir);
    slide.classList.remove('is-swap');
    void slide.offsetWidth;
    slide.classList.add('is-swap');
    nowEl.textContent = pad(i + 1);
    arrows[0].disabled = i === 0;
    arrows[1].disabled = i === n - 1;
  }

  function paint(e) {
    var l = nodeLen(0) + e * (nodeLen(n - 1) - nodeLen(0));
    var p = path.getPointAtLength(l);
    var a = path.getPointAtLength(Math.max(0, l - 2)), b = path.getPointAtLength(Math.min(len, l + 2));
    var deg = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    bike.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ') rotate(' + deg.toFixed(2) + ')');
    var spin = (l / (7 * cfg.bike) * 57.3).toFixed(1);
    Array.prototype.forEach.call(wheels, function (w) { w.setAttribute('transform', 'rotate(' + spin + ')'); });
    trail.style.strokeDashoffset = (len - l).toFixed(1);
    barEl.style.transform = 'scaleX(' + Math.max(0.03, e) + ')';
    var i = 0;
    while (i < n - 1 && nodeLen(i + 1) <= l + 1) i++;
    if (i !== at) setCard(i);
  }

  function goal() {
    var top = sec.getBoundingClientRect().top + parseFloat(getComputedStyle(sec).paddingTop);
    var p = Math.max(0, Math.min(1, -top / travel));
    var s = p * (n - 1), k = Math.min(n - 2, Math.floor(s));
    var g = Math.max(0, Math.min(1, (s - k - 0.18) / 0.64));
    return (k + g * g * (3 - 2 * g)) / (n - 1);
  }

  function frame() {
    var t = goal();
    cur = cur < 0 || calm ? t : cur + (t - cur) * 0.12;
    if (Math.abs(t - cur) < 0.0005) cur = t;
    paint(cur);
    ticking = cur !== t;
    if (ticking) requestAnimationFrame(frame);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  function layout() {
    sec.style.height = (parseFloat(getComputedStyle(sec).paddingTop) + innerHeight * (1 + 0.6 * (n - 1))) + 'px';
    travel = Math.max(1, sec.offsetHeight - parseFloat(getComputedStyle(sec).paddingTop) - innerHeight);
    onScroll();
  }

  function go(i) {
    i = Math.max(0, Math.min(n - 1, i));
    var top = sec.getBoundingClientRect().top + scrollY + parseFloat(getComputedStyle(sec).paddingTop);
    scrollTo({ top: top + travel * i / (n - 1) + 2, behavior: 'smooth' });
  }

  road.addEventListener('click', function (e) { var g = e.target.closest('.abt__node'); if (g) go(Number(g.dataset.i)); });
  road.addEventListener('keydown', function (e) {
    var g = e.target.closest('.abt__node');
    if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go(Number(g.dataset.i)); }
  });
  arrows.forEach(function (b) { b.addEventListener('click', function () { go(at + Number(b.dataset.dir)); }); });
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', layout);
  pc.addEventListener('change', function () { build(); layout(); });
  build();
  layout();
})();
