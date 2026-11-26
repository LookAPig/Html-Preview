/* ==== about-show.js · shared "stage + tabs" showcase used by map / story / craft ==== */
window.TeswayShow = function (root, opts) {
  var DUR = opts.dur || 6000;
  var rail = root.querySelector('.abs__rail');
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.abs__tab'));
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var now = -1, timer = 0, auto = !calm, seen = false;

  root.style.setProperty('--dur', DUR + 'ms');

  function reveal(i) {
    if (rail.scrollWidth <= rail.clientWidth + 1) return;
    var t = tabs[i];
    rail.scrollTo({ left: t.offsetLeft - (rail.clientWidth - t.offsetWidth) / 2, behavior: calm ? 'auto' : 'smooth' });
  }

  function run() {
    clearTimeout(timer);
    root.classList.remove('is-run');
    if (!auto || !seen) return;
    void root.offsetWidth;
    root.classList.add('is-run');
    timer = setTimeout(function () { select((now + 1) % tabs.length); }, DUR);
  }

  function select(i, user) {
    if (user) auto = false;
    if (i !== now) {
      var prev = now;
      now = i;
      tabs.forEach(function (t, k) {
        t.classList.toggle('is-on', k === i);
        t.setAttribute('aria-selected', String(k === i));
        t.tabIndex = k === i ? 0 : -1;
      });
      reveal(i);
      opts.onSelect(i, prev);
    }
    run();
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i, true); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var k = (i + d + tabs.length) % tabs.length;
      select(k, true);
      tabs[k].focus();
    });
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      seen = es[0].isIntersecting;
      if (seen) run(); else { clearTimeout(timer); root.classList.remove('is-run'); }
    }, { threshold: 0.4 }).observe(root);
  }

  select(0);
  return { select: select, index: function () { return now; } };
};

window.TeswayShow.rail = function (label, items, inner) {
  return '<div class="abs__rail"><div class="abs__tabs" role="tablist" aria-label="' + label + '">' +
    items.map(function (it, i) {
      return '<button class="abs__tab" type="button" role="tab" aria-selected="false" tabindex="-1">' +
        '<i class="abs__bar" aria-hidden="true"></i>' + inner(it, i) + '</button>';
    }).join('') + '</div></div>';
};

window.TeswayShow.swap = function (el, html) {
  el.innerHTML = html;
  el.classList.remove('abs-swap');
  void el.offsetWidth;
  el.classList.add('abs-swap');
};
