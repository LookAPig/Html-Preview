(function () {
  var PI = Math.PI;
  function ink(a) { return 'rgba(34, 34, 34, ' + a + ')'; }
  function volt(a) { return 'rgba(254, 84, 22, ' + a + ')'; }

  function ridge(c, w, g, top, waves, sharp) {
    c.beginPath();
    c.moveTo(0, g);
    for (var i = 0; i <= 240; i++) {
      var x = w * i / 240, y = top;
      waves.forEach(function (v) {
        var s = Math.abs(Math.sin(PI * v[0] * x / w + v[2]));
        y -= v[1] * (sharp ? 1 - s : s * s);
      });
      c.lineTo(x, y);
    }
    c.lineTo(w, g);
    c.closePath();
    c.fill();
  }

  function pine(c, x, y, s) {
    c.beginPath();
    for (var t = 0; t < 3; t++) {
      var b = y - s * (0.16 + t * 0.24), hw = s * (0.2 - t * 0.045);
      c.moveTo(x - hw, b); c.lineTo(x, b - s * 0.4); c.lineTo(x + hw, b); c.closePath();
    }
    c.rect(x - s * 0.025, y - s * 0.2, s * 0.05, s * 0.2);
    c.fill();
  }

  function tree(c, x, y, s) {
    c.fillRect(x - s * 0.03, y - s * 0.45, s * 0.06, s * 0.45);
    c.beginPath();
    c.arc(x, y - s * 0.72, s * 0.28, 0, PI * 2);
    c.arc(x - s * 0.2, y - s * 0.55, s * 0.2, 0, PI * 2);
    c.arc(x + s * 0.2, y - s * 0.58, s * 0.21, 0, PI * 2);
    c.fill();
  }

  function cut(c, fn) {
    c.save();
    c.globalCompositeOperation = 'destination-out';
    fn();
    c.restore();
  }

  function blocks(c, w, g, R, lo, hi, minW, maxW, win) {
    var x = -maxW * R();
    while (x < w) {
      var bw = minW + R() * (maxW - minW), bh = lo + R() * (hi - lo);
      c.fillRect(x, g - bh, bw, bh);
      if (!win && R() > 0.7) c.fillRect(x + bw * 0.45, g - bh - lo * 0.25, Math.max(1, bw * 0.04), lo * 0.25);
      if (win) cut(c, function () {
        c.fillStyle = ink(0.55);
        for (var y = g - bh + win * 1.6; y < g - win * 2; y += win * 2.4) {
          for (var xx = x + win; xx < x + bw - win * 1.5; xx += win * 2.2) c.fillRect(xx, y, win, win * 1.2);
        }
      });
      x += bw + minW * 0.08;
    }
  }

  function groundLine(c, w, g, h, bump) {
    c.strokeStyle = ink(1);
    c.lineWidth = h * 0.004;
    c.beginPath();
    for (var i = 0; i <= 120; i++) {
      var x = w * i / 120;
      c.lineTo(x, g - (bump ? h * bump * Math.abs(Math.sin(PI * 6 * x / w)) : 0));
    }
    c.stroke();
  }

  function sun(x, yk, r) {
    return function (c, w, h, g) {
      c.fillStyle = volt(0.06);
      c.beginPath(); c.arc(w * x, g - h * yk, h * r * 1.9, 0, PI * 2); c.fill();
      c.fillStyle = volt(0.16);
      c.beginPath(); c.arc(w * x, g - h * yk, h * r, 0, PI * 2); c.fill();
    };
  }

  function pin(c, cx, cy, r) {
    var sy = cy + r * 3.3;
    c.fillStyle = volt(0.1);
    c.beginPath(); c.ellipse(cx, sy, r * 1.5, r * 0.42, 0, 0, PI * 2); c.fill();
    c.fillStyle = volt(0.22);
    c.beginPath(); c.ellipse(cx, sy, r * 0.7, r * 0.2, 0, 0, PI * 2); c.fill();
    c.fillStyle = volt(0.12);
    c.beginPath(); c.arc(cx, cy, r * 1.85, 0, PI * 2); c.fill();
    c.fillStyle = volt(0.92);
    c.beginPath();
    c.moveTo(cx, cy + r * 2.3);
    c.bezierCurveTo(cx - r * 0.5, cy + r * 1.5, cx - r * 1.25, cy + r * 0.75, cx - r * 1.25, cy);
    c.arc(cx, cy, r * 1.25, PI, 0);
    c.bezierCurveTo(cx + r * 1.25, cy + r * 0.75, cx + r * 0.5, cy + r * 1.5, cx, cy + r * 2.3);
    c.fill();
    c.fillStyle = 'rgba(255, 255, 255, 0.95)';
    c.beginPath(); c.arc(cx, cy, r * 0.52, 0, PI * 2); c.fill();
    c.fillStyle = volt(0.92);
    c.beginPath(); c.arc(cx, cy, r * 0.22, 0, PI * 2); c.fill();
  }

  function box(c, x, y, s) {
    c.fillRect(x, y - s, s * 1.25, s);
    cut(c, function () { c.fillStyle = ink(0.6); c.fillRect(x + s * 0.55, y - s, s * 0.14, s); });
  }

  window.TESWAY_HOTKIT = { PI: PI, ink: ink, volt: volt, ridge: ridge, pine: pine, tree: tree, cut: cut, blocks: blocks, groundLine: groundLine, sun: sun, pin: pin, box: box };
})();
