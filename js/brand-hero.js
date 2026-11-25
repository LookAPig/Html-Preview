(function () {
  var arrow = '<svg class="bhero__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function html(h, svg) {
    var tag = h.tagline.join('<i>/</i>');
    var values = h.values.map(function (v) {
      return '<li><i class="btile__ico btile__ico--' + v.fx + '">' + svg(v.icon) + '</i><span>' + v.label + '</span></li>';
    }).join('');
    return '<article class="btile btile--hero reveal">' +
      '<div class="bscene" aria-hidden="true">' +
        '<img src="' + h.img + '" alt="" loading="lazy" decoding="async">' +
        '<span class="bscene__night"></span><span class="bscene__stars"></span>' +
        '<span class="bsun__glow"></span>' +
        '<span class="bsun__clip"><span class="bsun__disc"></span></span>' +
        '<span class="bscene__light"></span>' +
      '</div>' +
      '<p class="bhero__tag">' + tag + '</p>' +
      '<div class="btile__body bhero__body">' +
        '<p class="eyebrow eyebrow--dot">' + h.eyebrow + '</p>' +
        '<h3 class="btile__title">' + h.title + '</h3>' +
        '<p class="bhero__sub">' + h.sub + '</p>' +
        '<p class="btile__sub">' + h.text + '</p>' +
        '<a class="hbtn bhero__cta" href="' + h.cta.href + '">' + h.cta.text + arrow + '</a>' +
      '</div>' +
      '<ul class="bhero__values">' + values + '</ul>' +
      '</article>';
  }

  function init(tile) {
    var scene = tile.querySelector('.bscene');
    var mobile = matchMedia('(max-aspect-ratio: 999/1000)');
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ticking = false;

    function layout() {
      var tw = tile.clientWidth, th = tile.clientHeight, w, hh, x, y;
      if (mobile.matches) {
        hh = th * 0.6;
        w = hh * 16 / 9;
        x = -(w - tw) * 0.68;
        y = th - hh;
      } else {
        w = Math.max(tw, th * 16 / 9);
        hh = w * 9 / 16;
        x = -(w - tw) * 0.5;
        y = -(hh - th) * 0.7;
      }
      scene.style.width = w + 'px';
      scene.style.height = hh + 'px';
      scene.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    }

    var cur = -1;

    function target() {
      if (reduce) return 1;
      var r = tile.getBoundingClientRect();
      var start = innerHeight - r.height * 0.15;
      var end = (innerHeight - r.height) / 2;
      var t = Math.max(0, Math.min(1, (start - r.top) / Math.max(1, start - end)));
      return t * t * (3 - 2 * t);
    }

    function paint(v) {
      tile.style.setProperty('--rise', v.toFixed(4));
      tile.style.setProperty('--arc', Math.sin(v * Math.PI / 2).toFixed(4));
      tile.classList.toggle('is-night', v < 0.45);
    }

    function frame() {
      var goal = target();
      cur = cur < 0 ? goal : cur + (goal - cur) * 0.08;
      if (Math.abs(goal - cur) < 0.002) cur = goal;
      paint(cur);
      ticking = cur !== goal;
      if (ticking) requestAnimationFrame(frame);
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', function () { layout(); onScroll(); });
    layout();
    frame();
  }

  window.TESWAY_BRAND_HERO = { html: html, init: init };
})();
