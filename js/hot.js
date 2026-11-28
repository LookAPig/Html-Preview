/* ==== hot-data.js ==== */
window.TESWAY_HOT = {
  eyebrow: 'Best sellers',
  items: [
    {
      model: 'Dual', name: 'X1 Dual-Drive', img: 'Images/hot/bike-dual', scene: 'city',
      tagline: 'Two motors. Every road, every weather.',
      price: '$1,899', specs: '160 km range · 120 N·m',
      wheels: [{ x: 0.2349, y: 0.6007, r: 0.1641, rim: 0.1198 }, { x: 0.7693, y: 0.5979, r: 0.1632, rim: 0.1215 }],
      bb: { x: 0.5582, y: 0.6412 },
      cta: [{ label: 'Explore', href: 'product.html?id=dual' }, { label: 'Shop now', href: 'collection.html' }]
    },
    {
      model: 'Trail', name: 'X1 Trail Pro', img: 'Images/hot/bike-trail', scene: 'trail',
      tagline: 'Full suspension built for the long way round.',
      price: '$2,399', specs: '140 km range · 30° climb',
      wheels: [{ x: 0.2182, y: 0.5965, r: 0.1684, rim: 0.1302 }, { x: 0.7839, y: 0.5951, r: 0.1684, rim: 0.1311 }],
      bb: { x: 0.5764, y: 0.6204 },
      cta: [{ label: 'Explore', href: '#hot' }, { label: 'Shop now', href: 'collection.html' }]
    },
    {
      model: 'Family', name: 'X1 Family', img: 'Images/hot/bike-family', scene: 'park',
      tagline: 'A child seat, a low frame and calm power.',
      price: '$1,699', specs: '150 kg payload',
      wheels: [{ x: 0.2328, y: 0.6576, r: 0.138, rim: 0.0946 }, { x: 0.7401, y: 0.6549, r: 0.1389, rim: 0.0981 }],
      bb: { x: 0.5356, y: 0.6806 },
      cta: [{ label: 'Explore', href: '#uses' }, { label: 'Shop now', href: 'collection.html' }]
    },
    {
      model: 'Cargo', name: 'X1 Cargo', img: 'Images/hot/bike-cargo', scene: 'delivery',
      tagline: 'More orders per charge, all day long.',
      price: '$1,999', specs: '160 km range · 50 kg rack',
      wheels: [{ x: 0.2245, y: 0.6396, r: 0.1328, rim: 0.092 }, { x: 0.7443, y: 0.6382, r: 0.1337, rim: 0.0929 }],
      bb: { x: 0.5139, y: 0.6539 },
      cta: [{ label: 'Explore', href: '#uses' }, { label: 'Shop now', href: 'collection.html' }]
    }
  ]
};

/* ==== hot-canvas.js ==== */
(function () {
  var SPOKES = 36;
  var CRANK_RATIO = 0.4;

  function load(src) {
    var img = new Image();
    img.decoding = 'async';
    img.src = src;
    return img;
  }

  function ready(img) { return img.complete && img.naturalWidth > 0; }

  function spokes(ctx, rim, angle, width) {
    var hub = rim * 0.14;
    ctx.save();
    ctx.rotate(angle);
    ctx.strokeStyle = 'rgba(34, 34, 34, .72)';
    ctx.lineWidth = width;
    ctx.beginPath();
    for (var i = 0; i < SPOKES; i++) {
      var a = (i / SPOKES) * Math.PI * 2;
      var d = i % 2 ? 0.3 : -0.3;
      ctx.moveTo(Math.cos(a) * hub, Math.sin(a) * hub);
      ctx.lineTo(Math.cos(a + d) * rim, Math.sin(a + d) * rim);
    }
    ctx.stroke();
    ctx.restore();
  }

  function create(canvas, item, onReady) {
    var ctx = canvas.getContext('2d');
    var bb = item.bb;
    var body = load(item.img + (bb ? '-base.webp' : '.webp'));
    var frame = load(item.img + '-frame.webp');
    var crank = bb ? load(item.img + '-crank.webp') : null;
    var W = 0, H = 0, last = null;

    function loaded() { return ready(body) && ready(frame) && (!crank || ready(crank)); }

    function draw(angle) {
      if (!W || !loaded()) return;
      if (angle === last) return;
      last = angle;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(body, 0, 0, W, H);
      item.wheels.forEach(function (w) {
        var cx = w.x * W, cy = w.y * H, R = w.r * W, rim = w.rim * W;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.arc(cx, cy, rim, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.clearRect(cx - R, cy - R, R * 2, R * 2);
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.drawImage(body, -cx, -cy, W, H);
        ctx.restore();
        ctx.save();
        ctx.translate(cx, cy);
        spokes(ctx, rim, angle, Math.max(0.8, W / 1150));
        ctx.restore();
      });
      ctx.drawImage(frame, 0, 0, W, H);
      if (crank) {
        var bx = bb.x * W, by = bb.y * H;
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(angle * CRANK_RATIO);
        ctx.drawImage(crank, -bx, -by, W, H);
        ctx.restore();
      }
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.round(canvas.clientWidth * dpr);
      H = Math.round(canvas.clientHeight * dpr);
      canvas.width = W;
      canvas.height = H;
      last = null;
    }

    function done() {
      if (loaded()) { last = null; onReady(); }
    }
    body.onload = frame.onload = done;
    if (crank) crank.onload = done;

    return {
      draw: draw,
      resize: resize,
      radius: function () { return item.wheels[0].r * canvas.clientWidth; }
    };
  }

  window.TESWAY_HOTCV = { create: create };
})();

/* ==== hot-scene-kit.js ==== */
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

  function slide(c, x, g, s) {
    var p = s * 0.025;
    c.strokeStyle = c.fillStyle;
    c.fillRect(x, g - s * 0.8, p, s * 0.8);
    c.fillRect(x + s * 0.2, g - s * 0.8, p, s * 0.8);
    c.fillRect(x - s * 0.02, g - s * 0.56, s * 0.265, s * 0.035);
    for (var y = g - s * 0.1; y > g - s * 0.55; y -= s * 0.1) c.fillRect(x, y, s * 0.2, p * 0.8);
    c.beginPath();
    c.moveTo(x - s * 0.04, g - s * 0.8); c.lineTo(x + s * 0.11, g - s * 0.95); c.lineTo(x + s * 0.265, g - s * 0.8);
    c.fill();
    c.lineWidth = s * 0.05;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(x + s * 0.24, g - s * 0.53);
    c.bezierCurveTo(x + s * 0.45, g - s * 0.5, x + s * 0.52, g - s * 0.07, x + s * 0.82, g - s * 0.06);
    c.stroke();
    c.fillRect(x + s * 0.5, g - s * 0.22, p, s * 0.22);
    c.lineCap = 'butt';
  }

  function pin(c, cx, cy, r, bare) {
    var sy = cy + r * 3.3;
    if (!bare) shadow(c, cx, sy, r);
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

  function shadow(c, cx, sy, r) {
    c.fillStyle = volt(0.1);
    c.beginPath(); c.ellipse(cx, sy, r * 1.5, r * 0.42, 0, 0, PI * 2); c.fill();
    c.fillStyle = volt(0.22);
    c.beginPath(); c.ellipse(cx, sy, r * 0.7, r * 0.2, 0, 0, PI * 2); c.fill();
  }

  function box(c, x, y, s) {
    c.fillRect(x, y - s, s * 1.25, s);
    cut(c, function () { c.fillStyle = ink(0.6); c.fillRect(x + s * 0.55, y - s, s * 0.14, s); });
  }

  window.TESWAY_HOTKIT = { PI: PI, ink: ink, volt: volt, ridge: ridge, pine: pine, tree: tree, cut: cut, blocks: blocks, groundLine: groundLine, sun: sun, slide: slide, pin: pin, box: box };
})();

/* ==== hot-scene-art.js ==== */
(function () {
  var K = window.TESWAY_HOTKIT, PI = K.PI, ink = K.ink, volt = K.volt, ridge = K.ridge, pine = K.pine, tree = K.tree;
  var cut = K.cut, blocks = K.blocks, groundLine = K.groundLine, sun = K.sun, slide = K.slide, pin = K.pin, box = K.box;
  var DLV = { stacks: [[0.08, 0.046, 0.031], [0.86, 0.034]] };

  window.TESWAY_HOTART = {
    trail: [
      [0.25, 1, sun(0.64, 0.36, 0.045)],
      [0.25, 0.07, function (c, w, h, g) {
        c.fillStyle = ink(0.55);
        ridge(c, w, g, g - h * 0.1, [[2, h * 0.17, 0.4], [5, h * 0.07, 1.3], [9, h * 0.03, 0.2]], true);
        c.fillStyle = ink(1);
        ridge(c, w, g, g - h * 0.03, [[3, h * 0.11, 2.1], [7, h * 0.045, 0.7], [15, h * 0.018, 1.9]], true);
      }],
      [0.5, 0.13, function (c, w, h, g, R) {
        c.fillStyle = ink(1);
        ridge(c, w, g, g - h * 0.005, [[4, h * 0.025, 0], [10, h * 0.012, 1]]);
        for (var x = 0; x < w;) {
          var s = h * (0.08 + R() * 0.13);
          if (R() > 0.18) pine(c, x, g - h * 0.01, s);
          x += s * (0.22 + R() * 0.35);
        }
      }],
      [0.85, 0.22, function (c, w, h, g, R) {
        groundLine(c, w, g, h, 0.006);
        c.fillStyle = ink(1);
        for (var i = 0; i < 10; i++) {
          var r = h * (0.006 + R() * 0.012);
          c.beginPath(); c.ellipse(R() * w, g, r * 1.6, r, 0, PI, 0); c.fill();
        }
        c.lineWidth = h * 0.003;
        for (var j = 0; j < 26; j++) {
          var x = R() * w, l = h * (0.012 + R() * 0.018), d = l * 0.4;
          c.beginPath();
          c.moveTo(x, g); c.lineTo(x - d, g - l);
          c.moveTo(x, g); c.lineTo(x, g - l * 1.25);
          c.moveTo(x, g); c.lineTo(x + d, g - l);
          c.stroke();
        }
      }]
    ],
    city: [
      [0.25, 0.06, function (c, w, h, g, R) { c.fillStyle = ink(1); blocks(c, w, g, R, h * 0.12, h * 0.34, h * 0.05, h * 0.11, 0); }],
      [0.5, 0.11, function (c, w, h, g, R) { c.fillStyle = ink(1); blocks(c, w, g, R, h * 0.08, h * 0.2, h * 0.09, h * 0.17, h * 0.012); }],
      [0.85, 0.22, function (c, w, h, g) {
        groundLine(c, w, g, h, 0);
        c.setLineDash([h * 0.05, h * 0.035]);
        c.beginPath(); c.moveTo(0, g + h * 0.014); c.lineTo(w, g + h * 0.014); c.stroke();
        c.setLineDash([]);
        c.lineWidth = h * 0.005;
        c.fillStyle = ink(1);
        for (var k = 0; k < 5; k++) {
          var x = w * (k + 0.3) / 5;
          c.beginPath();
          c.moveTo(x, g); c.lineTo(x, g - h * 0.27);
          c.quadraticCurveTo(x, g - h * 0.3, x + h * 0.035, g - h * 0.3);
          c.stroke();
          c.fillRect(x + h * 0.03, g - h * 0.304, h * 0.032, h * 0.012);
        }
      }],
      [0.85, 1, function (c, w, h, g) {
        for (var k = 0; k < 5; k++) {
          var x = w * (k + 0.3) / 5 + h * 0.046;
          c.fillStyle = volt(0.1);
          c.beginPath(); c.arc(x, g - h * 0.29, h * 0.022, 0, PI * 2); c.fill();
          c.fillStyle = volt(0.45);
          c.beginPath(); c.arc(x, g - h * 0.291, h * 0.006, 0, PI * 2); c.fill();
        }
      }]
    ],
    park: [
      [0.25, 1, sun(0.3, 0.32, 0.04)],
      [0.25, 0.06, function (c, w, h, g) {
        c.fillStyle = ink(1);
        ridge(c, w, g, g - h * 0.09, [[2, h * 0.12, 0.5], [3, h * 0.07, 1.4], [7, h * 0.025, 0.3]]);
      }],
      [0.5, 0.12, function (c, w, h, g, R) {
        c.fillStyle = ink(1);
        var play = [[0.09, 0.22], [0.88, 0.18]];
        function open(x) {
          return play.every(function (p) { return x < w * p[0] - h * 0.1 || x > w * p[0] + h * p[1] * 0.95 + h * 0.06; });
        }
        for (var x = 0; x < w;) {
          var s = h * (0.16 + R() * 0.12);
          if (R() > 0.3 && open(x)) tree(c, x, g, s);
          x += s * (0.45 + R() * 0.6);
        }
        play.forEach(function (p) { slide(c, w * p[0], g, h * p[1]); });
        [[0.3, 1], [0.78, 0.8]].forEach(function (p) {
          var x = w * p[0], s = h * p[1];
          c.fillRect(x, g - s * 0.11, s * 0.14, s * 0.11);
          c.fillRect(x + s * 0.1, g - s * 0.17, s * 0.016, s * 0.04);
          c.beginPath(); c.moveTo(x - s * 0.012, g - s * 0.105); c.lineTo(x + s * 0.07, g - s * 0.165); c.lineTo(x + s * 0.152, g - s * 0.105); c.fill();
          cut(c, function () {
            c.fillRect(x + s * 0.025, g - s * 0.06, s * 0.025, s * 0.06);
            c.fillRect(x + s * 0.075, g - s * 0.08, s * 0.04, s * 0.03);
          });
        });
      }],
      [0.85, 0.2, function (c, w, h, g) {
        groundLine(c, w, g, h, 0);
        c.fillStyle = ink(1);
        [[0.04, 0.3], [0.6, 0.88]].forEach(function (run) {
          var a = w * run[0], b = w * run[1];
          for (var x = a; x <= b; x += h * 0.03) c.fillRect(x, g - h * 0.06, h * 0.006, h * 0.06);
          c.fillRect(a, g - h * 0.047, b - a + h * 0.006, h * 0.004);
          c.fillRect(a, g - h * 0.024, b - a + h * 0.006, h * 0.004);
        });
      }],
      [0.85, 1, function (c, w, h, g, R) {
        for (var i = 0; i < 18; i++) {
          var x = R() * w, y = g - h * (0.006 + R() * 0.014);
          c.fillStyle = R() > 0.5 ? volt(0.4) : ink(0.18);
          c.beginPath(); c.arc(x, y, h * 0.0045, 0, PI * 2); c.fill();
        }
      }]
    ],
    delivery: [
      [0.25, 0.05, function (c, w, h, g, R) { c.fillStyle = ink(1); blocks(c, w, g, R, h * 0.15, h * 0.3, h * 0.06, h * 0.12, 0); }],
      [0.25, 0.55, function (c, w, h, g) {
        pin(c, w * 0.22, g - h * 0.32, h * 0.012, true);
      }],
      [0.5, 0.11, function (c, w, h, g, R) {
        c.fillStyle = ink(1);
        for (var x = -h * 0.1 * R(); x < w;) {
          var sw = h * (0.12 + R() * 0.14), sh = h * (0.11 + R() * 0.16), up = sh > h * 0.2;
          c.fillRect(x, g - sh, sw, sh);
          if (R() > 0.55) c.fillRect(x + sw * (0.15 + R() * 0.5), g - sh - h * 0.03, sw * 0.18, h * 0.03);
          cut(c, function () {
            c.fillStyle = ink(0.7);
            c.fillRect(x + sw * 0.1, g - h * 0.07, sw * 0.5, h * 0.05);
            c.fillRect(x + sw * 0.68, g - h * 0.07, sw * 0.2, h * 0.07);
            c.fillStyle = ink(0.5);
            if (R() > 0.4) for (var s = 0; s < 6; s++) if (s % 2) c.fillRect(x + sw * (0.04 + s * 0.153), g - h * 0.095, sw * 0.153, h * 0.014);
            if (up) for (var y = g - sh + h * 0.03; y < g - h * 0.12; y += h * 0.04) {
              for (var k = 0; k < 3; k++) c.fillRect(x + sw * (0.12 + k * 0.28), y, sw * 0.16, h * 0.022);
            }
          });
          x += sw + (R() > 0.6 ? h * (0.02 + R() * 0.05) : h * 0.006);
        }
      }],
      [0.5, 0.75, function (c, w, h, g) {
        pin(c, w * 0.9, g - h * 0.24, h * 0.019, true);
      }],
      [0.85, 0.2, function (c, w, h, g) {
        groundLine(c, w, g, h, 0);
        c.fillStyle = ink(1);
        DLV.stacks.forEach(function (p) {
          var x = w * p[0], s = h * p[1];
          box(c, x, g, s);
          box(c, x + s * 1.35, g, s * 0.8);
          box(c, x + s * 0.2, g - s, s * 0.85);
        });
      }],
      [0.85, 1, function (c, w, h, g) {
        var p = DLV.stacks[0], s = h * p[1], r = h * p[2];
        pin(c, w * p[0] + s * 0.73, g - s * 1.85 - r * 3.3, r);
      }]
    ]
  };
})();

/* ==== hot-scene.js ==== */
(function () {
  var MAX_W = 1600;
  var GROUND = 0.82;

  function seed(n) {
    return function () { n = n * 16807 % 2147483647; return (n - 1) / 2147483646; };
  }

  function groundOf(item) {
    return item.wheels.reduce(function (m, w) { return Math.max(m, w.y + w.r * 4 / 3); }, 0);
  }

  function lift(item) {
    return ((GROUND - groundOf(item)) * 100).toFixed(2);
  }

  function create(canvas, item) {
    var art = window.TESWAY_HOTART;
    var spec = art && art[item.scene];
    var ctx = canvas.getContext('2d');
    var gy = GROUND;
    var W = 0, H = 0, dpr = 1, y0 = 0, layers = null, last = null;

    function build() {
      var top = Math.max(0, Math.floor(H * (gy - 0.5)));
      var bot = Math.min(H, Math.ceil(H * (gy + 0.04)));
      y0 = top;
      layers = spec.map(function (s, i) {
        var c = document.createElement('canvas');
        c.width = W;
        c.height = Math.max(1, bot - top);
        var x = c.getContext('2d');
        for (var t = -1; t <= 1; t++) {
          x.save();
          x.translate(t * W, -top);
          s[2](x, W, H, gy * H, seed(97 + i * 131));
          x.restore();
        }
        return { c: c, f: s[0], a: s[1] };
      });
    }

    function draw(shift) {
      if (!spec || !W) return;
      var px = Math.round(shift * dpr);
      if (px === last) return;
      last = px;
      if (!layers) build();
      ctx.clearRect(0, 0, W, H);
      layers.forEach(function (l) {
        var off = (-px * l.f) % W;
        if (off < 0) off += W;
        ctx.globalAlpha = l.a;
        ctx.drawImage(l.c, off - W, y0);
        ctx.drawImage(l.c, off, y0);
      });
      ctx.globalAlpha = 1;
    }

    function resize() {
      var cw = canvas.clientWidth, ch = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2, MAX_W / Math.max(cw, 1));
      W = Math.round(cw * dpr);
      H = Math.round(ch * dpr);
      canvas.width = W;
      canvas.height = H;
      layers = null;
      last = null;
    }

    return { draw: draw, resize: resize };
  }

  window.TESWAY_HOTSCENE = { create: create, lift: lift };
})();

/* ==== hot-m.js ==== */
(function () {
  var DURATION = 1700;

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  window.TESWAY_HOTM = function (slides, bikes, mq, reduce, scenes) {
    var stages = slides.map(function (s) { return s.querySelector('.hot__stage'); });
    var pos = slides.map(function () { return reduce ? 0 : -1; });
    var titles = slides.map(function (s) { return s.querySelector('.hot__title'); });

    function fade() {
      var vh = window.innerHeight;
      titles.forEach(function (t) {
        var y = t.getBoundingClientRect().top;
        if (y > vh * 1.2 || y < -vh) return;
        var f = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - y) / (vh * 0.5)));
        t.style.setProperty('--fade', f.toFixed(3));
      });
    }

    function offset(i) { return -pos[i] * slides[i].offsetWidth * 1.15; }

    function draw(i) {
      if (!mq.matches) return;
      var o = offset(i);
      stages[i].style.transform = o ? 'translate3d(' + o.toFixed(1) + 'px,0,0)' : '';
      bikes[i].draw(o / bikes[i].radius());
      scenes[i].draw(o);
    }

    function play(i) {
      var t0 = performance.now();
      function step(now) {
        var t = Math.min(1, (now - t0) / DURATION);
        pos[i] = ease(t) - 1;
        draw(i);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var io = 'IntersectionObserver' in window && !reduce && new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || !mq.matches) return;
        io.unobserve(e.target);
        play(slides.indexOf(e.target));
      });
    }, { threshold: 0.3 });

    if (io) slides.forEach(function (s) { io.observe(s); });
    else pos = pos.map(function () { return 0; });

    return {
      draw: draw,
      fade: fade,
      layout: function () { slides.forEach(function (s, i) { draw(i); }); },
      reset: function () { stages.forEach(function (s) { s.style.transform = ''; }); }
    };
  };
})();

/* ==== hot.js ==== */
(function () {
  var data = window.TESWAY_HOT;
  var cv = window.TESWAY_HOTCV;
  var section = document.getElementById('hot');
  if (!data || !cv || !section) return;

  var pin = section.querySelector('.hot__pin');
  var track = section.querySelector('.hot__track');
  var count = section.querySelector('.hot__now');
  var bar = section.querySelector('.hot__bar i');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  track.innerHTML = data.items.map(function (it, i) {
    return '<article class="hot__slide" aria-label="' + it.name + '">' +
      '<h2 class="hot__title" aria-hidden="true">' + it.model + '</h2>' +
      '<div class="hot__stage"><canvas class="hot__scene" aria-hidden="true"></canvas><i class="hot__shadow"></i><canvas class="hot__cv" style="top:' + window.TESWAY_HOTSCENE.lift(it) + '%" role="img" aria-label="' + it.name + '"></canvas></div>' +
      '<div class="hot__copy"><h3>' + it.name + '</h3><p class="hot__tag">' + it.tagline + '</p>' +
      '<p class="hot__meta">From <b>' + it.price + '</b><span>' + it.specs + '</span></p><div class="hot__cta">' +
      '<a class="hbtn" href="' + it.cta[0].href + '">' + it.cta[0].label + '</a>' +
      '<a class="hbtn hbtn--line" href="' + it.cta[1].href + '">' + it.cta[1].label + '</a>' +
      '</div></div></article>';
  }).join('');
  section.querySelector('.hot__total').textContent = String(data.items.length).padStart(2, '0');

  var slides = Array.prototype.slice.call(track.children);
  var titles = slides.map(function (s) { return s.querySelector('.hot__title'); });
  var copies = slides.map(function (s) { return s.querySelector('.hot__copy'); });
  var queued = false;
  var vh = 0, slideW = 0, dist = 0, current = -1;

  var mobile = window.matchMedia('(max-aspect-ratio: 999/1000)');
  var mob = null;

  var bikes = slides.map(function (s, i) {
    return cv.create(s.querySelector('.hot__cv'), data.items[i], function () {
      if (mobile.matches) mob.draw(i); else schedule();
    });
  });
  var scenes = slides.map(function (s, i) {
    return window.TESWAY_HOTSCENE.create(s.querySelector('.hot__scene'), data.items[i]);
  });
  mob = window.TESWAY_HOTM(slides, bikes, mobile, reduce, scenes);

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function flat() {
    section.style.height = '';
    track.style.transform = '';
    slides.forEach(function (s, i) { titles[i].style.transform = ''; copies[i].style.opacity = ''; });
    mob.layout();
    mob.fade();
  }

  function measure() {
    bikes.forEach(function (b) { b.resize(); });
    scenes.forEach(function (s) { s.resize(); });
    current = -1;
    if (mobile.matches) return flat();
    mob.reset();
    vh = pin.offsetHeight;
    slideW = slides[0].offsetWidth;
    dist = slideW * (slides.length - 1);
    section.style.height = vh + dist + 'px';
    update();
  }

  function update() {
    queued = false;
    if (mobile.matches) return mob.fade();
    var top = section.getBoundingClientRect().top;
    var enter = clamp(1 - top / vh, 0, 1);
    var x = clamp(-top, 0, dist);
    track.style.transform = 'translate3d(' + (-x).toFixed(1) + 'px,0,0)';
    var lift = (1 - enter) * vh * -0.22;
    var fade = reduce ? 1 : clamp(1 - top / vh, 0, 0.75) / 0.75;
    titles.forEach(function (t) { t.style.setProperty('--fade', fade.toFixed(3)); });

    slides.forEach(function (s, i) {
      var rel = (i * slideW - x) / slideW;
      if (Math.abs(rel) > 1.6) return;
      titles[i].style.transform = 'translate3d(' + (rel * slideW * 0.16).toFixed(1) + 'px,' + lift.toFixed(1) + 'px,0)';
      copies[i].style.opacity = clamp(1 - Math.abs(rel) * 1.6, 0, 1).toFixed(3);
      var angle = reduce ? 0 : -x / bikes[i].radius();
      bikes[i].draw(angle);
      scenes[i].draw(reduce ? 0 : rel * slideW);
    });

    var idx = clamp(Math.round(x / slideW), 0, slides.length - 1);
    if (idx !== current) {
      current = idx;
      count.textContent = String(idx + 1).padStart(2, '0');
      slides.forEach(function (s, i) { s.classList.toggle('is-on', i === idx); });
    }
    bar.style.transform = 'scaleX(' + (dist ? x / dist : 0).toFixed(4) + ')';
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure);
  mobile.addEventListener('change', measure);
  measure();
})();
