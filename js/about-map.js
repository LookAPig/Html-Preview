/* ==== about-map.js · global presence: region list + canvas map ==== */
(function () {
  var cv = document.getElementById('mapCanvas');
  var list = document.getElementById('mapRegions');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.map;
  if (!cv || !list || !data || !window.TESWAY_WORLD || !window.TeswayMapDraw) return;

  var STEP = 4500;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var map = window.TeswayMapDraw(cv, data, window.TESWAY_WORLD);
  var now = -1, timer = 0, auto = !calm, seen = false;

  list.innerHTML = data.regions.map(function (rg, i) {
    return '<button class="amap__region" type="button" role="tab" aria-selected="false" data-i="' + i + '">' +
      '<i class="amap__bar" aria-hidden="true"></i><b>' + rg.name + '</b><small>' + rg.meta + '</small></button>';
  }).join('');
  var btns = Array.prototype.slice.call(list.children);
  list.style.setProperty('--dur', STEP + 'ms');

  function run() {
    clearTimeout(timer);
    list.classList.remove('is-run');
    if (!auto || !seen) return;
    void list.offsetWidth;
    list.classList.add('is-run');
    timer = setTimeout(function () { set((now + 1) % btns.length); }, STEP);
  }

  function set(i, user) {
    if (user) auto = false;
    if (i !== now) {
      now = i;
      btns.forEach(function (b, k) {
        b.classList.toggle('is-on', k === i);
        b.setAttribute('aria-selected', String(k === i));
      });
      map.set(i);
    }
    run();
  }

  btns.forEach(function (b, i) {
    b.addEventListener('click', function () { set(i, true); });
    b.addEventListener('mouseenter', function (e) { if (e.pointerType !== 'touch' && matchMedia('(hover: hover)').matches) set(i, true); });
  });

  window.TeswayOnScene('map', function (v) {
    seen = v;
    map.play(v);
    run();
    if (v) window.TeswayCount(document.getElementById('mapStats'), 200);
  });

  set(0);
})();
