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
