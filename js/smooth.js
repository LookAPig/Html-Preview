/* ==== smooth.js · Lenis eased scrolling for the whole page ==== */
(function () {
  if (!window.Lenis || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var lenis = new window.Lenis({
    autoRaf: false,
    lerp: 0.09,
    smoothWheel: true,
    syncTouch: false,
    allowNestedScroll: true,
    anchors: false
  });
  window.TeswayLenis = lenis;

  /* shared helper for scripts that jump the page (dock, scrollbar, chapter nav) */
  window.TeswayScrollTo = function (y, smooth) {
    if (smooth) lenis.scrollTo(y, { duration: 1.4, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    else lenis.scrollTo(y, { immediate: true, force: true });
  };

  /* a page with its own render loop sets lenis.ext and calls lenis.raf() inside that frame */
  function loop(t) {
    if (!lenis.ext) lenis.raf(t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* drawers and modals lock the page with body overflow: pause Lenis while they are open */
  new MutationObserver(function () {
    if (document.body.style.overflow === 'hidden') lenis.stop(); else lenis.start();
  }).observe(document.body, { attributes: true, attributeFilter: ['style'] });
})();
