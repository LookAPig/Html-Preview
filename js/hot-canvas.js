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
