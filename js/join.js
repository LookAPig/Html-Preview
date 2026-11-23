(function () {
  var data = window.TESWAY_JOIN;
  var box = document.getElementById('joinBox');
  if (!data || !box) return;

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  function svg(paths, draw) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><g class="ico-base">' + paths + '</g>' +
      (draw ? '<g class="ico-draw">' + paths.replace(/\/>/g, ' pathLength="1"/>') + '</g>' : '') + '</svg>';
  }

  function col(c) {
    return '<div class="join__col" style="--dir:' + c.dir + '">' + c.photos.map(function (p) {
      return '<span class="join__ph" style="aspect-ratio:' + p[1] + '"><img src="' + p[0] + '" alt="" loading="lazy" decoding="async"></span>';
    }).join('') + '</div>';
  }

  box.innerHTML =
    '<div class="join__copy">' +
      '<p class="eyebrow eyebrow--dot">' + data.eyebrow + '</p>' +
      '<h2>' + data.title + '</h2>' +
      '<p class="sec-sub">' + data.sub + '</p>' +
      '<div class="join__socials">' + data.socials.map(function (s) {
        return '<a class="hbtn hbtn--line join__social" href="' + s.href + '">' + svg(s.icon, false) + s.name + '</a>';
      }).join('') + '</div>' +
      '<ul class="join__stats">' + data.stats.map(function (s) {
        return '<li>' + svg(s.icon, true) + '<strong data-n="' + s.n + '" data-suf="' + s.suf + '">0' + s.suf + '</strong><span>' + s.label + '</span></li>';
      }).join('') + '</ul>' +
    '</div>' +
    '<div class="join__wall" aria-hidden="true"><div class="join__cols">' + data.cols.map(col).join('') + '</div>' +
      '<b class="join__tag">' + data.tag + '</b></div>';

  var ticking = false;
  function update() {
    ticking = false;
    var rect = box.getBoundingClientRect();
    var vh = window.innerHeight;
    if (rect.bottom < 0 || rect.top > vh) return;
    var p = (vh - rect.top) / (vh + rect.height);
    box.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
  }
  function onScroll() {
    if (ticking || calm.matches) return;
    ticking = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  var nums = Array.prototype.slice.call(box.querySelectorAll('.join__stats strong'));
  function fmt(v) { return Math.round(v).toLocaleString('en-US'); }
  function count() {
    nums.forEach(function (el) {
      var to = Number(el.dataset.n), suf = el.dataset.suf;
      if (calm.matches) { el.textContent = fmt(to) + suf; return; }
      var t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, (t - t0) / 1600);
        el.textContent = fmt(to * (1 - Math.pow(1 - k, 3))) + suf;
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      count();
    }, { threshold: 0.4 });
    io.observe(box.querySelector('.join__stats'));
  } else count();
})();
