(function () {
  var DURATION = 1700;

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  window.TESWAY_HOTM = function (slides, bikes, mq, reduce) {
    var stages = slides.map(function (s) { return s.querySelector('.hot__stage'); });
    var pos = slides.map(function () { return reduce ? 0 : -1; });

    function offset(i) { return -pos[i] * slides[i].offsetWidth * 1.15; }

    function draw(i) {
      if (!mq.matches) return;
      var o = offset(i);
      stages[i].style.transform = o ? 'translate3d(' + o.toFixed(1) + 'px,0,0)' : '';
      bikes[i].draw(o / bikes[i].radius());
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
      layout: function () { slides.forEach(function (s, i) { draw(i); }); },
      reset: function () { stages.forEach(function (s) { s.style.transform = ''; }); }
    };
  };
})();
