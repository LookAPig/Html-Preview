/* ==== launch-scrub.js · writes scroll progress (--p, 0 → 1) onto [data-scrub] sections ==== */
(function () {
  var items = [], subs = [], vh = innerHeight, queued = false;

  /* pin: progress while the sticky child is held; pass: from entering the bottom to leaving the top */
  function progress(el, mode) {
    var r = el.getBoundingClientRect();
    if (mode === 'pin') {
      var span = r.height - vh;
      return span > 0 ? -r.top / span : (r.top <= 0 ? 1 : 0);
    }
    return (vh - r.top) / (vh + r.height);
  }

  function update() {
    queued = false;
    items.forEach(function (it) {
      var p = Math.min(1, Math.max(0, progress(it.el, it.mode)));
      if (Math.abs(p - it.p) < 0.0005) return;
      it.p = p;
      it.el.style.setProperty('--p', p.toFixed(4));
      it.fns.forEach(function (fn) { fn(p); });
    });
  }
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }
  function measure() {
    vh = innerHeight;
    subs.forEach(function (fn) { fn(); });
    items.forEach(function (it) { it.p = -1; });
    queue();
  }

  window.TeswayScrub = {
    on: function (el, fn) {
      var it = items.filter(function (x) { return x.el === el; })[0];
      if (it) it.fns.push(fn);
    },
    resize: function (fn) { subs.push(fn); },
    vh: function () { return vh; }
  };

  document.querySelectorAll('[data-scrub]').forEach(function (el) {
    items.push({ el: el, mode: el.dataset.scrub, p: -1, fns: [] });
  });
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', measure);
  addEventListener('load', measure);
  document.addEventListener('DOMContentLoaded', measure);
})();
