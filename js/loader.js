(function () {
  var root = document.getElementById('loader');
  if (!root) return;
  var body = document.body;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var spokes = function (cx, cy) {
    var s = '';
    for (var k = 0; k < 6; k++) {
      var a = k * Math.PI / 6, dx = Math.cos(a) * 21, dy = Math.sin(a) * 21;
      s += '<path d="M' + (cx - dx).toFixed(1) + ' ' + (cy - dy).toFixed(1) + 'L' + (cx + dx).toFixed(1) + ' ' + (cy + dy).toFixed(1) + '"/>';
    }
    return '<g class="lb-spokes" data-c="' + cx + ' ' + cy + '">' + s + '</g>';
  };
  var ln = function (d) { return '<path class="lb-ln" pathLength="1" d="' + d + '"/>'; };
  var ring = function (cx, cy, r) { return '<circle class="lb-ln" pathLength="1" cx="' + cx + '" cy="' + cy + '" r="' + r + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>'; };

  root.innerHTML =
    '<div class="loader__panel">' +
      '<canvas class="loader__cv"></canvas>' +
      '<div class="loader__stage">' +
        '<svg class="lb" viewBox="0 0 260 150" aria-hidden="true">' +
          '<path class="lb-beam" d="M176 34 L262 18 L262 58 Z"/>' +
          ring(62, 104, 30) + ring(198, 104, 30) + ring(62, 104, 23) + ring(198, 104, 23) +
          spokes(62, 104) + spokes(198, 104) +
          ln('M62 104 L124 106') + ln('M62 104 L106 52') + ln('M124 106 L104 44') +
          ln('M124 106 L166 50') + ln('M106 56 L164 46') + ln('M168 38 L198 104') +
          ln('M168 38 L163 26 L180 22') + ln('M92 41 Q105 36 118 41') +
          '<path class="lb-bat lb-bat-out" d="M134 92 L158 60"/><path class="lb-bat lb-bat-in" d="M134 92 L158 60"/>' +
          '<path class="lb-bat-ch" pathLength="1" d="M134 92 L158 60"/>' +
          '<circle class="lb-hub" cx="62" cy="104" r="7"/>' +
          '<g class="lb-crank" data-c="124 106"><circle cx="124" cy="106" r="6"/><path d="M124 106 L124 120 M120 120 H128"/></g>' +
          '<circle class="lb-light" cx="172" cy="34" r="3.2"/>' +
        '</svg>' +
        '<i class="loader__road"></i>' +
        '<div class="loader__meta">' +
          '<p class="loader__pct"><b>0</b><small>%</small></p>' +
          '<p class="loader__tip"><span class="loader__state">Charging</span><i></i><span class="loader__km">0 km range</span></p>' +
        '</div>' +
      '</div>' +
      '<p class="loader__word">GO FAR AWAY</p>' +
    '</div>';

  var $ = function (s) { return root.querySelector(s); };
  var lines = root.querySelectorAll('.lb-ln');
  var spin = root.querySelectorAll('[data-c]');
  var charge = $('.lb-bat-ch');
  var pct = $('.loader__pct b');
  var km = $('.loader__km');
  var road = $('.loader__road');
  var cv = $('.loader__cv');
  var ctx = cv.getContext('2d');
  var W = 0, H = 0, dpr = 1, streaks = [];

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    streaks = [];
    for (var k = 0; k < Math.round(W / 14); k++) {
      streaks.push({
        x: Math.random() * W, y: H * (0.28 + Math.random() * 0.44),
        len: 20 + Math.random() * 140, sp: 0.4 + Math.random() * 1.4,
        w: Math.random() < 0.2 ? 2 : 1, hot: Math.random() < 0.16
      });
    }
  }
  size();
  window.addEventListener('resize', size);

  var target = 0.12, shown = 0, start = performance.now(), last = start;
  var MIN = calm ? 300 : 2200, angle = 0, roadX = 0, boost = 0, phase = 0, raf = 0;
  var eager = [];
  function ready() {
    if (document.readyState === 'loading') return;
    target = Math.max(target, 0.5);
    eager = Array.prototype.filter.call(document.images, function (i) { return i.loading !== 'lazy'; });
  }
  document.addEventListener('DOMContentLoaded', ready);
  ready();
  window.addEventListener('load', function () { target = 1; });
  if (document.readyState === 'complete') target = 1;
  setTimeout(function () { target = 1; }, 5000);

  function draw(dt, speed) {
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    for (var k = 0; k < streaks.length; k++) {
      var s = streaks[k];
      s.x -= s.sp * speed * dt;
      if (s.x + s.len * (1 + boost) < 0) { s.x = W + Math.random() * W * 0.3; s.y = H * (0.28 + Math.random() * 0.44); }
      var len = s.len * (1 + boost * 2.5);
      var g = ctx.createLinearGradient(s.x, 0, s.x + len, 0);
      var c = s.hot ? '254,84,22' : '34,34,34';
      var a = (s.hot ? 0.55 : 0.14) * (0.25 + shown * 0.75);
      g.addColorStop(0, 'rgba(' + c + ',' + a + ')');
      g.addColorStop(1, 'rgba(' + c + ',0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = s.w;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + len, s.y); ctx.stroke();
    }
  }

  function tick(now) {
    var dt = Math.min(48, now - last);
    last = now;
    if (target < 1 && eager.length) {
      var ok = eager.filter(function (i) { return i.complete; }).length;
      target = Math.max(target, 0.5 + 0.42 * ok / eager.length);
    }
    var goal = Math.min(target, (now - start) / MIN);
    shown += (goal - shown) * Math.min(1, dt * 0.006);
    if (goal - shown < 0.003) shown = goal;
    var n = lines.length;
    for (var k = 0; k < n; k++) {
      var f = Math.min(1, Math.max(0, shown * 1.25 * n - k));
      lines[k].style.strokeDashoffset = (1 - f).toFixed(3);
    }
    charge.style.strokeDashoffset = (1 - shown).toFixed(3);
    pct.textContent = Math.round(shown * 100);
    km.textContent = Math.round(shown * 160) + ' km range';
    root.style.setProperty('--p', shown.toFixed(3));
    if (phase) boost = Math.min(4, boost + dt * 0.006);
    var speed = 0.12 + shown * 0.5 + boost;
    angle = (angle + dt * speed * 0.9) % 360;
    spin.forEach(function (g) { g.setAttribute('transform', 'rotate(' + angle.toFixed(1) + ' ' + g.dataset.c + ')'); });
    roadX -= dt * speed * 0.35;
    road.style.backgroundPositionX = roadX.toFixed(1) + 'px';
    draw(dt, speed);
    if (shown >= 1 && !phase) finish();
    raf = requestAnimationFrame(tick);
  }

  function finish() {
    phase = 1;
    root.classList.add('is-done');
    $('.loader__state').textContent = 'Ready to ride';
    var t = calm ? [0, 0, 400] : [380, 1050, 2300];
    setTimeout(function () { root.classList.add('is-go'); }, t[0]);
    setTimeout(function () {
      root.classList.add('is-out');
      body.classList.remove('is-loading');
      body.classList.add('is-ready');
    }, t[1]);
    setTimeout(function () {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      root.remove();
    }, t[2]);
  }

  raf = requestAnimationFrame(tick);
})();
