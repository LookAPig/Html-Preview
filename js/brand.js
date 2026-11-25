/* ==== brand-data.js ==== */
window.TESWAY_BRAND = {
  hero: {
    eyebrow: 'Ride for a bigger life',
    tagline: ['People', 'Places', 'A brighter tomorrow'],
    title: 'Go <em>beyond</em>',
    sub: 'More roads. More moments. A bigger life.',
    text: 'We build e-bikes with ultra-long range and versatile design to bring people, places and everyday adventures closer.',
    cta: { text: 'Explore now', href: '#hot' },
    img: 'Images/brand-beyond.jpg',
    values: [
      { fx: 'roll', label: 'Further journeys', icon: '<path d="M9 21 11 3M15 21 13 3"/><path d="M12 7v2M12 13v2M12 18v1.5"/>' },
      { fx: 'hop', label: 'For people you love', icon: '<circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="8" r="2.5"/><path d="M3.5 19a4.5 4.5 0 0 1 9 0M11.5 19a4.5 4.5 0 0 1 9 0"/>' },
      { fx: 'pulse', label: 'More possibilities', icon: '<path d="M2.5 19.5 9 9l4 6 2.5-3.5 6 8z"/><path d="m7.5 11.5 1.5 1.5 1.5-1.5"/>' },
      { fx: 'tilt', label: 'A cleaner tomorrow', icon: '<path d="M5 19C5 10 11 5 20 4c0 9-5 15-13 15z"/><path d="M5 19c3-4 6-7 10-9"/>' }
    ]
  },
  tiles: [
    {
      fx: 'roll', title: 'Free test ride', sub: 'At partner dealers near you', img: 'Images/story-camp.jpg',
      icon: '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16 9.5 9h5l3.5 7M9.5 9 12 16h-6M13 6h2.5l-1 3"/>'
    },
    {
      fx: 'pulse', big: '2 yr', sub: 'Warranty on frame, motors & battery', img: 'Images/scenes/scene-hunting.jpg',
      icon: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'
    },
    {
      fx: 'hop', title: 'Doorstep delivery', sub: 'Free shipping, ready to ride', img: 'Images/story-delivery.jpg',
      icon: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/>'
    },
    {
      fx: 'tilt', title: 'Rider support', sub: 'Chat, video & dealer network', img: 'Images/hero-family.jpg',
      icon: '<path d="M4.5 13v-1a7.5 7.5 0 0 1 15 0v1"/><rect x="3.5" y="13" width="4" height="6" rx="1.5"/><rect x="16.5" y="13" width="4" height="6" rx="1.5"/><path d="M18.5 19c0 1.2-1.5 2-4 2"/>'
    }
  ]
};

/* ==== brand-hero.js ==== */
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

/* ==== brand.js ==== */
(function () {
  var box = document.getElementById('brandBox');
  var data = window.TESWAY_BRAND;
  var hero = window.TESWAY_BRAND_HERO;
  if (!box || !data || !hero) return;

  function svg(paths) {
    var draw = paths.replace(/<(path|circle|rect)/g, '<$1 pathLength="1"');
    return '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<g class="ico-base">' + paths + '</g><g class="ico-draw">' + draw + '</g></svg>';
  }

  function tile(t, i) {
    var ico = '<i class="btile__ico btile__ico--' + t.fx + '">' + svg(t.icon) + '</i>';
    var head = t.big ? ico + '<strong class="btile__big">' + t.big + '</strong>' : ico + '<h3 class="btile__title">' + t.title + '</h3>';
    return '<article class="btile reveal" data-delay="' + (i + 1) + '">' +
      '<img class="btile__img" src="' + t.img + '" alt="" loading="lazy" decoding="async">' +
      '<div class="btile__body">' + head + '<p class="btile__sub">' + t.sub + '</p></div></article>';
  }

  box.innerHTML = hero.html(data.hero, svg) + data.tiles.map(tile).join('');
  hero.init(box.firstChild);
})();
