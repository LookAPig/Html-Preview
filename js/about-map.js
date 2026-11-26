/* ==== about-map.js · region tabs + detail card driving the 3D map ==== */
(function () {
  var box = document.getElementById('mapRegions');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.map;
  if (!box || !data) return;

  var STEP = 5000;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var now = -1, timer = 0, auto = !calm, seen = false;

  function facts(meta) {
    return meta.split(' · ').map(function (s) {
      var m = s.match(/^([\d+–-]+)\s+(.*)$/);
      return m ? { v: m[1], l: m[2] } : { v: '', l: s };
    });
  }

  box.innerHTML = '<div class="amap__tabs" role="tablist" aria-label="Regions">' + data.regions.map(function (rg, i) {
    return '<button class="amap__tab" type="button" role="tab" aria-selected="false" data-i="' + i + '">' + rg.name + '</button>';
  }).join('') + '</div><div class="amap__card" role="tabpanel" aria-live="polite"><div class="amap__body"></div><i class="amap__prog" aria-hidden="true"></i></div>';
  var tabs = Array.prototype.slice.call(box.querySelectorAll('.amap__tab'));
  var card = box.querySelector('.amap__card');
  var body = box.querySelector('.amap__body');
  card.style.setProperty('--dur', STEP + 'ms');

  function fill(rg) {
    body.innerHTML = '<p class="amap__name"><b>' + rg.name + '</b><span>' + rg.pins.map(function (p) { return p.name; }).join(' · ') + '</span></p>' +
      '<ul class="amap__facts">' + facts(rg.meta).map(function (f) {
        return '<li><b>' + f.v + '</b><span>' + f.l + '</span></li>';
      }).join('') + '</ul>';
  }

  function run() {
    clearTimeout(timer);
    card.classList.remove('is-run');
    if (!auto || !seen) return;
    void card.offsetWidth;
    card.classList.add('is-run');
    timer = setTimeout(function () { set((now + 1) % tabs.length); }, STEP);
  }

  function set(i, user) {
    if (user) auto = false;
    if (i !== now) {
      now = i;
      tabs.forEach(function (b, k) {
        b.classList.toggle('is-on', k === i);
        b.setAttribute('aria-selected', String(k === i));
      });
      card.classList.remove('is-swap');
      void card.offsetWidth;
      fill(data.regions[i]);
      card.classList.add('is-swap');
      document.dispatchEvent(new CustomEvent('aregion', { detail: i }));
    }
    run();
  }

  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { set(i, true); });
  });

  window.TeswayOnScene('map', function (v) {
    seen = v;
    run();
    if (v) window.TeswayCount(document.getElementById('mapStats'), 200);
  });

  set(0);
})();
