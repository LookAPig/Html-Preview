(function () {
  var data = window.TESWAY_USES;
  var list = document.getElementById('usesList');
  if (!data || !list) return;

  var desk = window.matchMedia('(min-aspect-ratio: 1/1)');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var total = pad(data.length);
  var HOLD = 3200;
  var arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  function pad(v) { return String(v).padStart(2, '0'); }

  list.innerHTML = data.map(function (u, i) {
    return '<article class="use" aria-label="' + u.name + '" style="--i:' + i + '">' +
      '<img src="' + u.img + '" alt="' + u.name + ' with a TESWAY e-bike" loading="lazy" decoding="async">' +
      '<span class="use__no">' + pad(i + 1) + '</span>' +
      '<div class="use__body"><p class="use__eyebrow">' + pad(i + 1) + ' / ' + total + ' · Best with ' + u.bike + '</p>' +
      '<h3>' + u.name + '</h3><div class="use__more"><div><p class="use__desc">' + u.desc + '</p>' +
      '<ul class="use__tags">' + u.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      '<a class="hbtn hbtn--light use__link" href="#hot">Shop ' + u.bike + arrow + '</a></div></div></div></article>';
  }).join('');

  var items = Array.prototype.slice.call(list.children);
  var current = -1;
  var timer = 0;
  var live = false;
  var hold = false;

  function set(i) {
    if (i === current) return;
    current = i;
    items.forEach(function (el, k) { el.classList.toggle('is-on', k === i); });
  }

  function tick() {
    clearTimeout(timer);
    if (!desk.matches || calm.matches || !live || hold) return;
    timer = setTimeout(function () {
      set((current + 1) % items.length);
      tick();
    }, HOLD);
  }

  function pause() { hold = true; clearTimeout(timer); }
  function resume() { hold = false; tick(); }

  items.forEach(function (el, i) {
    el.addEventListener('pointerenter', function (e) {
      if (!desk.matches || e.pointerType !== 'mouse') return;
      pause();
      set(i);
    });
    el.addEventListener('pointerleave', function () { if (desk.matches) resume(); });
    el.addEventListener('focusin', function () { if (desk.matches) { pause(); set(i); } });
    el.addEventListener('focusout', function () { if (desk.matches) resume(); });
  });

  desk.addEventListener('change', function () {
    clearTimeout(timer);
    if (desk.matches) tick();
  });

  if ('IntersectionObserver' in window) {
    var secIo = new IntersectionObserver(function (entries) {
      live = entries.some(function (e) { return e.isIntersecting; });
      if (live) tick();
      else clearTimeout(timer);
    }, { threshold: 0.35 });
    secIo.observe(list);
  }

  set(0);
  tick();
})();
