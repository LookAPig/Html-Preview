/* ==== about-craft.js ==== */
(function () {
  var box = document.getElementById('craftBox');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.craft;
  if (!box || !data) return;

  var STEP = 4200;
  var WAVE = '<svg class="abc__wave" viewBox="0 0 160 14" fill="none" aria-hidden="true">' +
    '<path pathLength="1" d="M4 9.5C16 3 26 2.5 36 6.5s17 6.5 30 2.5 22-7.5 34-3.5 19 6 31 2.5 15-4.5 25-3"/></svg>';
  var calm = matchMedia('(prefers-reduced-motion: reduce)');
  var mobile = matchMedia('(max-aspect-ratio: 999/1000)');
  function pad(n) { return String(n).padStart(2, '0'); }

  box.innerHTML =
    '<div class="abc__stage reveal">' +
      '<ul class="abc__stats">' + data.stats.map(function (s, i) {
        return '<li><b><span data-count="' + s.value + '" data-plain data-wait="' + (400 + i * 150) + '">' + s.value + '</span><small>' + s.unit + '</small></b>' + s.label + '</li>';
      }).join('') + '</ul>' +
      '<div class="abc__bike">' +
        '<img src="' + data.img + '" alt="TESWAY X1 Dual-Drive frame" loading="lazy" decoding="async">' +
        data.points.map(function (p, i) {
          return '<button class="abc__spot" type="button" data-i="' + i + '" style="--x:' + p.x + '%;--y:' + p.y + '%;--i:' + i + '" aria-label="' + p.title + '">' +
            '<i>' + pad(i + 1) + '</i><span>' + p.title + '</span></button>';
        }).join('') +
      '</div>' +
    '</div>' +
    '<ol class="abc__list">' + data.points.map(function (p, i) {
      return '<li class="abc__item reveal" data-delay="' + Math.min(i, 3) + '" data-i="' + i + '" tabindex="0">' +
        '<span class="abc__no">' + pad(i + 1) + '</span>' +
        '<h3>' + p.title + WAVE + '</h3><p>' + p.text + '</p></li>';
    }).join('') + '</ol>';

  var spots = Array.prototype.slice.call(box.querySelectorAll('.abc__spot'));
  var items = Array.prototype.slice.call(box.querySelectorAll('.abc__item'));
  var list = box.querySelector('.abc__list');
  var now = -1, timer = 0, auto = true, seen = false, syncing = 0;

  function show(i, scroll) {
    if (i !== now) {
      now = i;
      spots.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      items.forEach(function (it, k) { it.classList.toggle('is-on', k === i); });
      if (scroll && mobile.matches) {
        syncing = Date.now();
        list.scrollTo({ left: items[i].offsetLeft - parseFloat(getComputedStyle(list).paddingLeft), behavior: 'smooth' });
      }
    }
    clearTimeout(timer);
    if (auto && seen && !calm.matches) timer = setTimeout(function () { show((now + 1) % items.length, true); }, STEP);
  }
  function pick(i, scroll) { auto = false; show(i, scroll); }

  spots.forEach(function (s, i) { s.addEventListener('click', function () { pick(i, true); }); });
  items.forEach(function (it, i) {
    it.addEventListener('mouseenter', function () { if (!mobile.matches) pick(i); });
    it.addEventListener('focus', function () { pick(i); });
    it.addEventListener('click', function () { pick(i); });
  });

  var st = 0;
  list.addEventListener('scroll', function () {
    if (!mobile.matches || Date.now() - syncing < 700) return;
    clearTimeout(st);
    st = setTimeout(function () {
      var w = items[1].offsetLeft - items[0].offsetLeft;
      var i = Math.max(0, Math.min(items.length - 1, Math.round(list.scrollLeft / w)));
      if (i !== now) pick(i);
    }, 90);
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      seen = es[0].isIntersecting;
      if (seen) show(now < 0 ? 0 : now); else clearTimeout(timer);
    }, { threshold: 0.4 }).observe(box.querySelector('.abc__stage'));
  } else show(0);
  if (window.TeswayCount) window.TeswayCount.watch(box);
})();
