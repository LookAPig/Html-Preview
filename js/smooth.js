/* ==== smooth.js · Lenis eased scrolling for the whole site ==== */
(function () {
  if (!window.Lenis || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement, body = document.body;
  var lenis = new window.Lenis({
    autoRaf: false,
    lerp: 0.09,
    smoothWheel: true,
    syncTouch: false,
    allowNestedScroll: true,
    anchors: false
  });
  window.TeswayLenis = lenis;

  function ease(t) { return 1 - Math.pow(1 - t, 4); }
  /* elements land below the fixed nav, honouring scroll-padding-top and scroll-margin-top */
  function yOf(el) {
    var pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    var gap = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    return el.getBoundingClientRect().top + scrollY - pad - gap;
  }

  /* shared helper: target is a pixel offset or an element */
  window.TeswayScrollTo = function (target, smooth) {
    var y = typeof target === 'number' ? target : yOf(target);
    sync();
    if (smooth) lenis.scrollTo(y, { duration: 1.4, easing: ease, force: true });
    else lenis.scrollTo(y, { immediate: true, force: true });
  };

  /* a page with its own render loop sets lenis.ext and calls lenis.raf() inside that frame */
  function loop(t) {
    if (!lenis.ext) lenis.raf(t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* drawers, menus and the loader lock the page via body overflow (inline or class): pause Lenis */
  function sync() {
    if (getComputedStyle(body).overflow === 'hidden') lenis.stop(); else lenis.start();
  }
  new MutationObserver(sync).observe(body, { attributes: true, attributeFilter: ['style', 'class'] });
  sync();

  /* in-page anchors: runs after page-specific handlers, which mark the event as handled */
  window.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var a = e.target.closest('a[href^="#"]');
    var id = a && a.getAttribute('href').slice(1);
    var el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    history.pushState(null, '', '#' + id);
    window.TeswayScrollTo(el, true);
  });
})();
