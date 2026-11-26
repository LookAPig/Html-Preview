/* ==== about-map-draw.js · canvas dot-matrix map with glowing hubs and routes ==== */
window.TeswayMapDraw = function (cv, data, world) {
  var ctx = cv.getContext('2d');
  var CROP = { x: 0, y: 2, w: 120, h: 38 };
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = matchMedia('(max-aspect-ratio: 999/1000)');
  var SIG2 = 2 * 3.4 * 3.4;

  function grid(p) { return { x: (p.lon + 180) / world.step, y: (world.top - p.lat) / world.step + 0.5 }; }

  var land = [];
  world.rows.forEach(function (row, j) {
    for (var i = 0; i < row.length; i++) if (row[i] === 'x') land.push(i + 0.5, j + 0.5);
  });

  var hq = grid(data.hq);
  hq.i = 0.7; hq.hq = true; hq.name = data.hq.name;
  var hubs = [hq];
  data.regions.forEach(function (rg, r) {
    rg.pins.forEach(function (p, k) {
      var g = grid(p);
      g.r = r; g.big = !!p.big; g.i = 0.3; g.ph = (r * 3 + k) * 0.37;
      g.label = p.big && rg.pins.indexOf(p) === 0 ? rg.label : '';
      g.dx = g.x - hq.x; g.dy = g.y - hq.y;
      g.lift = Math.sqrt(g.dx * g.dx + g.dy * g.dy) * 0.34;
      hubs.push(g);
    });
  });

  var W = 0, H = 0, dpr = 1, active = 0, cam = { x: 60, y: 21 }, raf = 0, on = false;

  function resize() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    draw(performance.now(), true);
  }

  function focus() {
    if (!mobile.matches) return { x: CROP.x + CROP.w / 2, y: CROP.y + CROP.h / 2 };
    var ps = hubs.filter(function (h) { return h.r === active; });
    var x = 0, y = 0;
    ps.forEach(function (h) { x += h.x; y += h.y; });
    return { x: x / ps.length, y: y / ps.length };
  }

  function view() {
    var vw = mobile.matches ? 62 : CROP.w, s = W / vw, vh = H / s;
    var l = Math.max(CROP.x, Math.min(CROP.x + CROP.w - vw, cam.x - vw / 2));
    var t = Math.max(CROP.y, Math.min(CROP.y + CROP.h - vh, cam.y - vh / 2));
    return { s: s, l: l, t: t };
  }

  function qpt(h, u) {
    var cx = hq.x + h.dx / 2, cy = hq.y + h.dy / 2 - h.lift, a = 1 - u;
    return { x: a * a * hq.x + 2 * a * u * cx + u * u * h.x, y: a * a * hq.y + 2 * a * u * cy + u * u * h.y };
  }

  function draw(now, still) {
    var t = now / 1000, k = still ? 1 : 0.06;
    var f = focus();
    cam.x += (f.x - cam.x) * k; cam.y += (f.y - cam.y) * k;
    hubs.forEach(function (h) {
      if (h.hq) return;
      h.i += ((h.r === active ? 1 : 0.22) - h.i) * (still ? 1 : 0.08);
      h.glow = h.i * (calm ? 1 : 0.82 + 0.18 * Math.sin(t * 1.7 + h.ph));
    });
    hq.glow = 0.7;
    var v = view(), s = v.s;
    function X(x) { return (x - v.l) * s; }
    function Y(y) { return (y - v.t) * s; }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    var dr = s * 0.2;
    for (var n = 0; n < land.length; n += 2) {
      var gx = land[n], gy = land[n + 1], px = X(gx), py = Y(gy);
      if (px < -4 || px > W + 4 || py < -4 || py > H + 4) continue;
      var b = 0;
      for (var m = 0; m < hubs.length; m++) {
        var h = hubs[m], ddx = gx - h.x, ddy = gy - h.y, d2 = ddx * ddx + ddy * ddy;
        if (d2 < 120) b += h.glow * Math.exp(-d2 / SIG2) * (h.hq ? 0.5 : 0.75);
      }
      b = Math.min(1, b);
      ctx.fillStyle = 'rgba(' + (255 - 1 * b | 0) + ',' + (255 - 171 * b * 0.85 | 0) + ',' + (255 - 233 * b * 0.85 | 0) + ',' + (0.13 + 0.62 * b).toFixed(3) + ')';
      ctx.fillRect(px - dr, py - dr, dr * 2, dr * 2);
    }

    ctx.lineCap = 'round';
    hubs.forEach(function (h) {
      if (h.hq) return;
      ctx.beginPath();
      ctx.moveTo(X(hq.x), Y(hq.y));
      ctx.quadraticCurveTo(X(hq.x + h.dx / 2), Y(hq.y + h.dy / 2 - h.lift), X(h.x), Y(h.y));
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.04 + 0.12 * h.i).toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
      if (h.i < 0.35 || calm) return;
      var u = ((t / 3.4 + h.ph) % 1) * 1.35, head = Math.min(1, u), tail = Math.max(0, u - 0.28);
      if (tail >= 1) return;
      ctx.lineWidth = 1.6;
      for (var q = 0; q < 10; q++) {
        var a = qpt(h, tail + (head - tail) * q / 10), c = qpt(h, tail + (head - tail) * (q + 1) / 10);
        ctx.strokeStyle = 'rgba(254,84,22,' + ((q + 1) / 10 * h.i).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(X(a.x), Y(a.y)); ctx.lineTo(X(c.x), Y(c.y)); ctx.stroke();
      }
    });

    hubs.forEach(function (h) {
      var x = X(h.x), y = Y(h.y), R = s * (h.hq ? 4.2 : h.big ? 3.6 : 2.4) * (0.75 + 0.35 * h.glow);
      var g = ctx.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, h.hq ? 'rgba(255,255,255,.22)' : 'rgba(254,84,22,' + (0.38 * h.glow).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(254,84,22,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fill();
      if (h.big && h.i > 0.5 && !calm) {
        var p = (t / 2.4 + h.ph) % 1;
        ctx.strokeStyle = 'rgba(254,84,22,' + ((1 - p) * 0.7).toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y, s * (0.6 + p * 3.4), 0, 7); ctx.stroke();
      }
      ctx.fillStyle = '#FFF';
      ctx.beginPath(); ctx.arc(x, y, h.hq ? 3.2 : h.big ? 2.4 : 1.6, 0, 7); ctx.fill();
      if (h.hq) {
        ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y, 6.5, 0, 7); ctx.stroke();
      }
      var label = h.hq ? h.name : h.label;
      if (!label || (mobile.matches && !h.hq && h.r !== active)) return;
      ctx.font = '600 ' + (mobile.matches ? 10 : 11) + 'px Inter, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,' + (h.hq ? 0.85 : 0.35 + 0.65 * h.i).toFixed(3) + ')';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + 9, y);
    });
  }

  function loop(now) { draw(now); if (on) raf = requestAnimationFrame(loop); }

  addEventListener('resize', resize);
  resize();
  return {
    set: function (r) { active = r; if (!on) draw(performance.now(), true); },
    play: function (yes) {
      if (yes === on) return;
      on = yes;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(loop);
    }
  };
};
