/* ==== about-time.js · bike rides an SVG road through the year tabs ==== */
(function () {
  var box = document.getElementById('timeBox');
  var list = window.TESWAY_ABOUT && window.TESWAY_ABOUT.time;
  var Show = window.TeswayShow;
  if (!box || !list || !Show) return;

  var n = list.length;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var WHEEL = '<g class="abt__wheel"><circle r="7"/><path d="M0-7v14M-7 0h14"/></g>';
  var BIKE = '<g class="abt__bike"><g class="abt__rig">' +
    '<g transform="translate(-11 -7)">' + WHEEL + '</g><g transform="translate(11 -7)">' + WHEEL + '</g>' +
    '<path class="abt__frame" d="M-11-7H-1L-5-17ZM-5-17 6-18M6-18 11-7M5-21 6-18M3.5-21.5H8M-7.5-18H-2.5"/>' +
    '<path class="abt__batt" d="M-1-7 6-18"/></g></g>';

  box.innerHTML =
    '<div class="abs__stage">' +
      '<div class="abs__view abt__view" id="timeView"></div>' +
      '<div class="abs__info" id="timeInfo" aria-live="polite"></div>' +
    '</div>' +
    Show.rail('Milestones', list, function (t) { return '<b class="abt__yr">' + t.year + '</b><small>' + t.title + '</small>'; });

  var view = document.getElementById('timeView');
  var info = document.getElementById('timeInfo');
  var tabsEl = box.querySelector('.abs__tabs');
  var tabs = Array.prototype.slice.call(box.querySelectorAll('.abs__tab'));
  var road = document.createElement('div');
  road.className = 'abt__road';
  road.setAttribute('aria-hidden', 'true');
  tabsEl.insertBefore(road, tabsEl.firstChild);
  list.forEach(function (t) { new Image().src = t.img; });

  var path, trail, bike, wheels, nodes = [], stops = [], len = 0, scale = 1;
  var at = 0, l = 0, raf = 0;

  function build() {
    var W = tabsEl.scrollWidth, H = road.offsetHeight;
    if (!W || !H) return;
    var base = H * 0.74, amp = H * 0.13;
    var xs = tabs.map(function (t) { return t.offsetLeft + t.offsetWidth / 2; });
    var parts = ['M0 ' + base.toFixed(1) + 'H' + xs[0].toFixed(1)];
    for (var i = 1; i < n; i++) {
      var a = xs[i - 1], b = xs[i], d = (b - a) / 3, y = (base + (i % 2 ? -amp : amp)).toFixed(1);
      parts.push('C' + (a + d).toFixed(1) + ' ' + y + ' ' + (b - d).toFixed(1) + ' ' + y + ' ' + b.toFixed(1) + ' ' + base.toFixed(1));
    }
    parts.push('H' + W);
    var dStr = parts.join('');
    scale = H / 46;
    road.innerHTML = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' +
      '<path class="abt__line" d="' + dStr + '"/><path class="abt__trail" d="' + dStr + '"/>' +
      xs.map(function (x) { return '<circle class="abt__node" cx="' + x.toFixed(1) + '" cy="' + base.toFixed(1) + '" r="3.5"/>'; }).join('') +
      BIKE + '</svg>';
    path = road.querySelector('.abt__line');
    trail = road.querySelector('.abt__trail');
    bike = road.querySelector('.abt__bike');
    wheels = road.querySelectorAll('.abt__wheel');
    nodes = Array.prototype.slice.call(road.querySelectorAll('.abt__node'));
    road.querySelector('.abt__rig').setAttribute('transform', 'scale(' + scale.toFixed(3) + ')');
    len = path.getTotalLength();
    trail.style.strokeDasharray = len;
    var probe = document.createElementNS(NS, 'path');
    road.firstChild.appendChild(probe);
    stops = xs.map(function (x, k) { probe.setAttribute('d', parts.slice(0, k + 1).join('')); return probe.getTotalLength(); });
    probe.remove();
    l = stops[at];
    place(1);
  }

  function place(dir) {
    var p = path.getPointAtLength(l);
    var a = path.getPointAtLength(Math.max(0, l - 2)), b = path.getPointAtLength(Math.min(len, l + 2));
    var deg = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    bike.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ') rotate(' + deg.toFixed(2) + ') scale(' + dir + ' 1)');
    var spin = (l / (7 * scale) * 57.3 * dir).toFixed(1);
    Array.prototype.forEach.call(wheels, function (w) { w.setAttribute('transform', 'rotate(' + spin + ')'); });
    trail.style.strokeDashoffset = (len - l).toFixed(1);
    nodes.forEach(function (c, i) { c.classList.toggle('is-past', stops[i] <= l + 0.5); });
  }

  function ride(i) {
    cancelAnimationFrame(raf);
    at = i;
    if (!path) return;
    var from = l, to = stops[i], dir = to < from ? -1 : 1;
    var dur = calm ? 0 : 600 + 1000 * Math.abs(to - from) / len, t0 = 0;
    function step(t) {
      if (!t0) t0 = t;
      var p = dur ? Math.min(1, (t - t0) / dur) : 1;
      var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      l = from + (to - from) * e;
      place(dir);
      if (p < 1) raf = requestAnimationFrame(step); else place(1);
    }
    raf = requestAnimationFrame(step);
  }

  function render(i) {
    var t = list[i];
    Show.swap(view, '<img src="' + t.img + '" alt="' + t.title + '" decoding="async">');
    Show.swap(info,
      '<p class="abs__kick">' + t.year + ' · Chapter ' + (i + 1) + ' / ' + n + '</p>' +
      '<h3 class="abs__title">' + t.title + '</h3>' +
      '<p class="abs__text">' + t.text + '</p>');
    ride(i);
  }

  Show(box, { dur: 5500, onSelect: render });
  var rt = 0;
  addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { cancelAnimationFrame(raf); build(); }, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  build();
})();
