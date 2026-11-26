/* ==== about-time.js · story board: flat 2D strip → 3D floor ride → flat 2D ==== */
(function () {
  var world = document.getElementById('timeWorld');
  var rail = document.getElementById('timeRail');
  var srList = document.getElementById('timeList');
  var list = window.TESWAY_ABOUT && window.TESWAY_ABOUT.time;
  if (!world || !rail || !list) return;

  var n = list.length;
  var mobile = matchMedia('(max-aspect-ratio: 999/1000)');
  var WHEEL = '<g class="tw__wheel"><circle r="26"/><circle class="tw__rim" r="19"/><path d="M-19 0h38M0-19v38M-13.4-13.4l26.8 26.8M13.4-13.4l-26.8 26.8"/><circle class="tw__hub" r="4"/></g>';
  var BIKE = '<svg viewBox="-80 -98 160 100">' +
    '<g transform="translate(-46 -30)">' + WHEEL + '</g><g transform="translate(46 -30)">' + WHEEL + '</g>' +
    '<path class="tw__frame" d="M-46-30-4-28M-46-30-14-66M-4-28-16-76M-14-68 30-76M30-78 34-62M34-62 46-30M-16-76-18-84M30-78 27-90"/>' +
    '<path class="tw__batt" d="M34-62-4-28"/><path class="tw__seat" d="M-28-86H-8M20-92 34-89"/>' +
    '<path class="tw__stripe" d="M18-48 9-40"/><circle class="tw__crank" cx="-4" cy="-28" r="7"/></svg>';

  srList.innerHTML = list.map(function (t) { return '<li>' + t.year + ': ' + t.title + '. ' + t.text + '</li>'; }).join('');
  rail.innerHTML = '<li class="atime__fill" aria-hidden="true"><i></i></li>' + list.map(function (t, i) {
    return '<li><button type="button" data-i="' + i + '" aria-label="' + t.year + ': ' + t.title + '"><i></i><span>' + t.year + '</span></button></li>';
  }).join('');
  world.innerHTML = '<div class="tw__cam"><div class="tw__board">' +
    '<svg class="tw__road"><path class="tw__line"/><path class="tw__trail"/>' +
    list.map(function (t) { return '<text class="tw__mark">' + t.year + '</text>'; }).join('') + '</svg>' +
    list.map(function () { return '<i class="tw__shade"></i>'; }).join('') +
    list.map(function (t) {
      return '<article class="tcard"><div class="tcard__in"><img src="' + t.img + '" alt="" loading="lazy" decoding="async">' +
        '<div class="tcard__body"><b>' + t.year + '</b><h3>' + t.title + '</h3><p>' + t.text + '</p></div></div></article>';
    }).join('') +
    '<i class="tw__shade tw__shade--bike"></i><div class="tw__bike">' + BIKE + '</div></div></div>';

  var cam = world.querySelector('.tw__cam');
  var board = world.querySelector('.tw__board');
  var road = world.querySelector('.tw__road');
  var line = world.querySelector('.tw__line');
  var trail = world.querySelector('.tw__trail');
  var marks = Array.prototype.slice.call(world.querySelectorAll('.tw__mark'));
  var cards = Array.prototype.slice.call(world.querySelectorAll('.tcard'));
  var shades = Array.prototype.slice.call(world.querySelectorAll('.tw__shade'));
  var bike = world.querySelector('.tw__bike');
  var wheels = bike.querySelectorAll('.tw__wheel');
  var dots = Array.prototype.slice.call(rail.querySelectorAll('button'));
  var fill = rail.querySelector('.atime__fill i');
  var G = {}, last = -1, lastIdx = -2;

  function roadY(x) { return G.ry + G.amp * Math.sin(x / G.gap * Math.PI * 0.9); }

  function layout() {
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize), m = mobile.matches;
    G = {
      cw: (m ? 13.5 : 18) * rem, gap: (m ? 21 : 30) * rem, h: (m ? 34 : 42) * rem, ry: (m ? 24 : 29) * rem,
      pad: (m ? 15 : 24) * rem, amp: 1.6 * rem, bw: (m ? 7.5 : 10) * rem, lift: 2.5 * rem, back: (m ? 5.5 : 7.5) * rem
    };
    G.L = G.pad * 2 + (n - 1) * G.gap + G.cw;
    G.xs = list.map(function (_, i) { return G.pad + i * G.gap; });
    G.stops = G.xs.map(function (x) { return x - G.back; });
    var W = world.clientWidth;
    G.z0 = Math.max(m ? 0.3 : 0.26, Math.min(1, W * 0.9 / G.L));
    G.f0 = G.z0 * G.L > W * 0.95 ? W * 0.46 / G.z0 : G.L / 2;
    G.z1 = m ? 0.9 : 1;
    board.style.width = G.L + 'px';
    board.style.height = G.h + 'px';
    road.setAttribute('viewBox', '0 0 ' + G.L + ' ' + G.h);
    road.setAttribute('width', G.L); road.setAttribute('height', G.h);
    var d = 'M0 ' + roadY(0).toFixed(1);
    for (var x = 30; x <= G.L; x += 30) d += 'L' + x + ' ' + roadY(x).toFixed(1);
    line.setAttribute('d', d); trail.setAttribute('d', d);
    trail.setAttribute('pathLength', G.L);
    trail.style.strokeDasharray = G.L;
    G.xs.forEach(function (x, i) {
      var cx = x + G.cw / 2, bottom = G.h - (roadY(cx) - G.lift);
      cards[i].style.cssText = 'left:' + x + 'px;bottom:' + bottom + 'px;width:' + G.cw + 'px';
      shades[i].style.cssText = 'left:' + (x - G.cw * 0.05) + 'px;width:' + G.cw * 1.1 + 'px;top:' + (G.h - bottom) + 'px';
      marks[i].setAttribute('x', cx); marks[i].setAttribute('y', roadY(cx) + 4.6 * rem);
    });
    bike.style.width = G.bw + 'px';
    last = -1;
  }

  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function seg(u, a, b) { return cl((u - a) / (b - a)); }
  function io(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function eo(t) { return 1 - Math.pow(1 - t, 3); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function ride(r) {
    var f = r * (n - 1), k = Math.min(n - 2, Math.floor(f)), q = f - k;
    q = q < 0.3 ? 0 : q > 0.7 ? 1 : io((q - 0.3) / 0.4);
    if (r >= 1) { k = n - 2; q = 1; }
    return lerp(G.stops[k], G.stops[k + 1], q);
  }

  function update(u) {
    if (!G.L) layout();
    if (Math.abs(u - last) < 1e-5) return;
    last = u;
    var kin = io(seg(u, 0.07, 0.2)), kout = io(seg(u, 0.85, 0.97)), k = kin * (1 - kout);
    var r = seg(u, 0.21, 0.84), bx = ride(r);
    var fx = lerp(G.f0, bx, k), fy = lerp(G.h / 2, roadY(bx), k);
    var m = mobile.matches;
    cam.style.left = lerp(50, m ? 34 : 38, k) + '%';
    cam.style.top = lerp(m ? 48 : 54, m ? 60 : 66, k) + '%';
    cam.style.transform = 'rotateX(' + (58 * k).toFixed(2) + 'deg) rotateZ(' + ((m ? -12 : -16) * k).toFixed(2) + 'deg) scale(' + lerp(G.z0, G.z1, k).toFixed(4) + ')';
    board.style.transform = 'translate3d(' + (-fx).toFixed(1) + 'px,' + (-fy).toFixed(1) + 'px,0)';

    var idx = u < 0.2 ? -1 : u > 0.86 ? n : Math.round(r * (n - 1));
    cards.forEach(function (c, i) {
      var s = eo(seg(u, 0.13 + i * 0.012, 0.21 + i * 0.012)) * (1 - io(seg(u, 0.84 + (n - 1 - i) * 0.008, 0.9 + (n - 1 - i) * 0.008)));
      c.style.transform = 'rotateX(' + (-90 * s).toFixed(2) + 'deg)';
      shades[i].style.opacity = (s * 0.8).toFixed(3);
    });
    var sb = eo(seg(u, 0.12, 0.2)) * (1 - io(seg(u, 0.84, 0.9)));
    var by = roadY(bx), ang = Math.atan2(roadY(bx + 20) - roadY(bx - 20), 40) * 57.3;
    bike.style.left = (bx - G.bw / 2) + 'px';
    bike.style.bottom = (G.h - by) + 'px';
    bike.style.transform = 'rotateZ(' + ang.toFixed(2) + 'deg) rotateX(' + (-90 * sb).toFixed(2) + 'deg)';
    var spin = (bx / (26 * G.bw / 160) * 57.3).toFixed(1);
    Array.prototype.forEach.call(wheels, function (w) { w.style.transform = 'rotate(' + spin + 'deg)'; });
    var sh = shades[n];
    sh.style.cssText = 'left:' + (bx - G.bw * 0.5) + 'px;width:' + G.bw + 'px;top:' + by + 'px;opacity:' + (sb * 0.9).toFixed(3);
    trail.style.strokeDashoffset = (G.L - (u > 0.86 ? G.L : bx)).toFixed(1);
    fill.style.transform = 'scaleX(' + (u > 0.86 ? 1 : r).toFixed(4) + ')';

    if (idx !== lastIdx) {
      lastIdx = idx;
      bike.classList.toggle('is-dual', idx >= 2);
      cards.forEach(function (c, i) { c.classList.toggle('is-on', i === idx); c.classList.toggle('is-past', i <= idx); });
      marks.forEach(function (mk, i) { mk.classList.toggle('is-past', i <= idx); });
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === idx); d.classList.toggle('is-past', i <= idx); });
      world.classList.toggle('is-3d', idx > -1 && idx < n);
    }
  }

  rail.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (b && window.TeswayStage) window.TeswayStage.story(0.21 + 0.63 * Number(b.dataset.i) / (n - 1));
  });
  var rt = 0;
  addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { var u = Math.max(0, last); layout(); update(u); }, 120); });

  window.TeswayTime = { update: update };
})();
