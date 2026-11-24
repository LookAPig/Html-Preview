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
      '<div class="hot__stage"><canvas class="hot__scene" aria-hidden="true"></canvas><i class="hot__shadow"></i><canvas class="hot__cv" role="img" aria-label="' + it.name + '"></canvas></div>' +
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
