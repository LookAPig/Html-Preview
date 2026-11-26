/* ==== about-scene.js · canvas landscape, road, signposts and bike for the story timeline ==== */
window.TeswayScene = function (cv) {
  var ctx = cv.getContext('2d');
  var W = 0, H = 0, dpr = 1, a = 1, gy = 0, bx = 0, k = 1;
  var dust = [];
  var INK = '#222', VOLT = '#FE5416';

  function resize() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    var m = W < H;
    a = Math.min(H / 900, W / (m ? 420 : 1440)) * (m ? 1.1 : 1);
    gy = H * (m ? 0.82 : 0.8);
    bx = W * (m ? 0.32 : 0.36);
    k = (m ? 0.82 : 1.25) * Math.max(0.8, Math.min(1.25, a * (m ? 1 : 1.1)));
    return { bx: bx, w: W, off: 108 * k };
  }

  function road(wx) { return gy + (14 * Math.sin(wx * 0.0035) + 7 * Math.sin(wx * 0.0091 + 1)) * a; }
  function hash(n) { var s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); }

  function layer(par, base, amp, f, fill, D) {
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (var sx = 0; sx <= W + 8; sx += 8) {
      var wx = sx + D * par;
      ctx.lineTo(sx, base - (amp[0] * Math.sin(wx * f[0]) + amp[1] * Math.sin(wx * f[1] + 2) + amp[2] * Math.abs(Math.sin(wx * f[2]))) * a);
    }
    ctx.lineTo(W, H);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function tree(x, y, h) {
    ctx.fillStyle = 'rgba(34,34,34,.13)';
    for (var i = 0; i < 3; i++) {
      var w = h * (0.42 - i * 0.09), top = y - h * (0.45 + i * 0.22);
      ctx.beginPath(); ctx.moveTo(x - w, top + h * 0.38); ctx.lineTo(x, top); ctx.lineTo(x + w, top + h * 0.38); ctx.fill();
    }
    ctx.fillRect(x - 1, y - h * 0.2, 2, h * 0.2);
  }

  function seg(c, ln, x1, y1, x2, y2, w) { c.lineWidth = ln ? 1.2 / k : w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }

  function bike(x, y, ang, rot, crank, solid, motors) {
    [0, 1].forEach(function (ln) {
      var al = ln ? 1 - solid : solid;
      if (al < 0.01) return;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(ang); ctx.scale(k, k);
      ctx.globalAlpha = al;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = ln ? 'rgba(34,34,34,.6)' : INK;
      ctx.setLineDash(ln ? [3 / k, 3 / k] : []);
      [-46, 46].forEach(function (wx) {
        ctx.lineWidth = ln ? 1.2 / k : 8;
        ctx.beginPath(); ctx.arc(wx, -30, ln ? 30 : 26, 0, 7); ctx.stroke();
        ctx.lineWidth = ln ? 1 / k : 1.2;
        ctx.beginPath(); ctx.arc(wx, -30, 20, 0, 7); ctx.stroke();
        ctx.globalAlpha = al * 0.55;
        for (var s = 0; s < 4; s++) {
          var r = rot + s * Math.PI / 4;
          seg(ctx, ln, wx - Math.cos(r) * 20, -30 - Math.sin(r) * 20, wx + Math.cos(r) * 20, -30 + Math.sin(r) * 20, 0.9);
        }
        ctx.globalAlpha = al;
        ctx.fillStyle = motors ? VOLT : INK;
        ctx.beginPath(); ctx.arc(wx, -30, !ln && motors ? 7 : 3.5, 0, 7);
        if (ln) ctx.stroke(); else ctx.fill();
      });
      seg(ctx, ln, -46, -30, -4, -28, 3.2);
      seg(ctx, ln, -46, -30, -14, -66, 2.6);
      seg(ctx, ln, -4, -28, -16, -76, 3.4);
      seg(ctx, ln, -14, -68, 30, -76, 4);
      seg(ctx, ln, 30, -78, 34, -62, 4.5);
      seg(ctx, ln, 34, -62, 46, -30, 3.4);
      seg(ctx, ln, 34, -62, -4, -28, 8);
      if (!ln) { ctx.strokeStyle = VOLT; seg(ctx, 0, 18, -48, 9, -40, 2.4); ctx.strokeStyle = INK; }
      seg(ctx, ln, -16, -76, -18, -84, 2.4);
      seg(ctx, ln, -28, -86, -8, -86, 4.5);
      seg(ctx, ln, 30, -78, 27, -90, 3);
      seg(ctx, ln, 20, -92, 34, -89, 3.4);
      ctx.lineWidth = ln ? 1.2 / k : 1.6;
      ctx.beginPath(); ctx.arc(-4, -28, 7, 0, 7); ctx.stroke();
      var cx = Math.cos(crank) * 11, cy = Math.sin(crank) * 11;
      seg(ctx, ln, -4, -28, -4 + cx, -28 + cy, 3);
      seg(ctx, ln, -8 + cx, -28 + cy, 0 + cx, -28 + cy, 3.4);
      ctx.restore();
    });
  }

  function draw(st) {
    var D = st.D, bw = bx + D;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    var sx0 = W * 0.82 - D * 0.02, sy0 = gy - H * 0.24;
    var sun = ctx.createRadialGradient(sx0, sy0, 0, sx0, sy0, 150 * a);
    sun.addColorStop(0, 'rgba(254,84,22,.12)'); sun.addColorStop(1, 'rgba(254,84,22,0)');
    ctx.fillStyle = sun; ctx.fillRect(0, 0, W, H);

    layer(0.12, gy - H * 0.2, [42, 24, 16], [0.0036, 0.0105, 0.021], 'rgba(34,34,34,.045)', D);
    layer(0.35, gy - H * 0.085, [24, 12, 8], [0.0062, 0.017, 0.031], 'rgba(34,34,34,.06)', D);

    var t0 = Math.floor(D / 150) - 1;
    for (var ti = t0; ti < t0 + W / 150 + 3; ti++) {
      if (hash(ti) < 0.45) continue;
      var tx = ti * 150 + hash(ti + 9) * 90 - D;
      tree(tx, road(tx + D) - 2 * a, (34 + hash(ti + 3) * 30) * a);
    }

    ctx.beginPath(); ctx.moveTo(0, H);
    for (var sx = 0; sx <= W + 8; sx += 8) ctx.lineTo(sx, road(sx + D));
    ctx.lineTo(W, H); ctx.fillStyle = '#FFF'; ctx.fill();

    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.setLineDash([6, 8]);
    for (sx = Math.max(0, bx - 4); sx <= W + 8; sx += 6) ctx.lineTo(sx, road(sx + D));
    ctx.strokeStyle = 'rgba(34,34,34,.28)'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath();
    var startX = Math.max(0, -D);
    for (sx = startX; sx <= bx; sx += 6) ctx.lineTo(sx, road(sx + D));
    ctx.strokeStyle = VOLT; ctx.lineWidth = 3; ctx.stroke();

    st.marks.forEach(function (m, i) {
      var x = m - D;
      if (x < -120 || x > W + 120) return;
      var y = road(m), past = i <= st.idx, ph = 74 * a, fw = 70 * a, fh = 28 * a;
      ctx.strokeStyle = past ? VOLT : 'rgba(34,34,34,.35)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - ph); ctx.stroke();
      ctx.fillStyle = past ? VOLT : '#FFF';
      ctx.beginPath(); ctx.roundRect(x, y - ph, fw, fh, 4 * a); ctx.fill();
      if (!past) { ctx.strokeStyle = 'rgba(34,34,34,.2)'; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.fillStyle = past ? '#FFF' : INK;
      ctx.font = Math.round(16 * a) + 'px Anton, Impact, sans-serif';
      ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
      ctx.fillText(st.years[i], x + fw / 2, y - ph + fh / 2 + 1);
      ctx.fillStyle = past ? VOLT : '#FFF';
      ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill();
      if (!past) { ctx.strokeStyle = 'rgba(34,34,34,.35)'; ctx.stroke(); }
    });

    if (Math.abs(st.v) > 0.6 && dust.length < 40) {
      dust.push({ x: bw - 46 * k, y: road(bw - 46 * k), vx: -Math.random() * 0.6 * Math.sign(st.v), vy: -0.3 - Math.random() * 0.6, r: 1 + Math.random() * 2, l: 1 });
    }
    dust = dust.filter(function (p) { return p.l > 0; });
    dust.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.l -= 0.025;
      ctx.fillStyle = 'rgba(34,34,34,' + (0.18 * p.l).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(p.x - D, p.y, p.r, 0, 7); ctx.fill();
    });

    var by = road(bw), ang = Math.atan2(road(bw + 20) - road(bw - 20), 40);
    bike(bx, by, ang, bw / (30 * k), bw / (30 * k) * 0.45, st.solid, st.motors);
    return dust.length > 0;
  }

  return { resize: resize, draw: draw };
};
