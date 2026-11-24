(function () {
  var K = window.TESWAY_HOTKIT, PI = K.PI, ink = K.ink, volt = K.volt, ridge = K.ridge, pine = K.pine, tree = K.tree;
  var cut = K.cut, blocks = K.blocks, groundLine = K.groundLine, sun = K.sun, pin = K.pin, box = K.box;

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
        for (var x = 0; x < w;) {
          var s = h * (0.16 + R() * 0.12);
          if (R() > 0.3) tree(c, x, g, s);
          x += s * (0.45 + R() * 0.6);
        }
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
      [0.5, 0.11, function (c, w, h, g, R) {
        c.fillStyle = ink(1);
        for (var x = -h * 0.1 * R(); x < w;) {
          var sw = h * (0.17 + R() * 0.09), sh = h * (0.15 + R() * 0.08);
          c.fillRect(x, g - sh, sw, sh);
          cut(c, function () {
            c.fillStyle = ink(0.7);
            c.fillRect(x + sw * 0.1, g - sh * 0.48, sw * 0.5, sh * 0.34);
            c.fillRect(x + sw * 0.68, g - sh * 0.48, sw * 0.2, sh * 0.48);
            c.fillStyle = ink(0.5);
            c.fillRect(x + sw * 0.15, g - sh * 0.86, sw * 0.7, sh * 0.1);
            for (var s = 0; s < 6; s++) if (s % 2) c.fillRect(x + sw * (0.04 + s * 0.153), g - sh * 0.6, sw * 0.153, sh * 0.08);
          });
          x += sw + h * 0.008;
        }
      }],
      [0.85, 0.2, function (c, w, h, g) {
        groundLine(c, w, g, h, 0);
        c.fillStyle = ink(1);
        var s = h * 0.04;
        [0.1, 0.84].forEach(function (p) {
          var x = w * p;
          box(c, x, g, s);
          box(c, x + s * 1.35, g, s * 0.8);
          box(c, x + s * 0.2, g - s, s * 0.85);
        });
      }],
      [0.85, 1, function (c, w, h, g) {
        pin(c, w * 0.1 + h * 0.029, g - h * 0.166, h * 0.028);
        pin(c, w * 0.84 + h * 0.029, g - h * 0.166, h * 0.028);
      }]
    ]
  };
})();
