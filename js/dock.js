(function () {
  var D = window.TESWAY_DOCK;
  if (!D) return;
  var T = D.text, I = D.icons;
  var ico = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + I[k] + '"/></svg>'; };
  var R = 21, C = 2 * Math.PI * R;

  var dock = document.createElement('div');
  dock.className = 'dock';
  dock.id = 'dock';
  dock.innerHTML =
    '<div class="dock__card" id="dockCard" role="dialog" aria-label="' + T.title + '" aria-hidden="true">' +
      '<div class="dock__head"><div><strong>' + T.title + '</strong><p>' + T.sub + '</p></div>' +
        '<button class="dock__x" type="button" aria-label="' + T.close + '">' + ico('close') + '</button></div>' +
      '<div class="dock__opts">' + D.options.map(function (o, i) {
        return '<a class="dock__opt' + (o.hot ? ' is-hot' : '') + '" href="' + o.href + '" style="--i:' + i + '">' +
          '<i>' + ico(o.icon) + '</i><span><b>' + o.title + '</b><small>' + o.meta + '</small></span></a>';
      }).join('') + '</div>' +
    '</div>' +
    '<div class="dock__rail">' +
      '<button class="dock__btn dock__top" type="button" style="--i:0" aria-label="' + T.top + '" data-tip="' + T.top + '">' +
        '<svg class="dock__ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="' + R + '"/>' +
        '<circle class="dock__prog" cx="24" cy="24" r="' + R + '" stroke-dasharray="' + C.toFixed(2) + '"/></svg>' + ico('up') +
      '</button>' +
      '<button class="dock__btn dock__help" type="button" style="--i:1" aria-label="' + T.help + '" data-tip="' + T.help + '" aria-expanded="false" aria-controls="dockCard">' +
        ico('chat') + '<i class="dock__dot"></i>' +
      '</button>' +
      '<button class="dock__fold" type="button" style="--i:2" aria-label="' + T.hide + '">' + ico('fold') + '</button>' +
    '</div>' +
    '<button class="dock__tab" type="button" aria-label="' + T.show + '" tabindex="-1">' + ico('open') + '</button>';
  document.body.appendChild(dock);

  var card = dock.querySelector('.dock__card');
  var help = dock.querySelector('.dock__help');
  var topBtn = dock.querySelector('.dock__top');
  var prog = dock.querySelector('.dock__prog');
  var tab = dock.querySelector('.dock__tab');
  var hidden = false, pinned = false, last = window.scrollY, ticking = false, idle = 0;
  var IDLE = 10000;

  function wake() {
    clearTimeout(idle);
    idle = setTimeout(function () {
      if (!hidden) return;
      setHide(false, true);
      last = window.scrollY;
    }, IDLE);
  }

  function setHelp(open) {
    dock.classList.toggle('is-help', open);
    help.setAttribute('aria-expanded', String(open));
    card.setAttribute('aria-hidden', String(!open));
  }

  function setHide(h, byUser) {
    if (byUser) pinned = h;
    if (h === hidden) return;
    hidden = h;
    if (h) setHelp(false);
    dock.classList.toggle('is-hide', h);
    tab.tabIndex = h ? 0 : -1;
    dock.querySelectorAll('.dock__rail button').forEach(function (b) { b.tabIndex = h ? -1 : 0; });
  }

  function frame() {
    ticking = false;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.strokeDashoffset = (C * (1 - (max > 0 ? Math.min(1, y / max) : 0))).toFixed(2);
    dock.classList.toggle('is-top', y < window.innerHeight * .4);
    var dy = y - last;
    if (Math.abs(dy) < 8) return;
    if (dy > 0 && y > 160) setHide(true);
    else if (dy < 0 && !pinned) setHide(false);
    last = y;
  }

  window.addEventListener('scroll', function () {
    wake();
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  window.addEventListener('resize', frame);

  topBtn.addEventListener('click', function () {
    setHelp(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  help.addEventListener('click', function () { setHelp(!dock.classList.contains('is-help')); });
  dock.querySelector('.dock__x').addEventListener('click', function () { setHelp(false); help.focus(); });
  dock.querySelector('.dock__fold').addEventListener('click', function () { setHide(true, true); wake(); tab.focus(); });
  tab.addEventListener('click', function () {
    setHide(false, true);
    last = window.scrollY;
    help.focus({ preventScroll: true });
  });
  card.addEventListener('click', function (e) { if (e.target.closest('.dock__opt')) setHelp(false); });

  document.addEventListener('click', function (e) {
    if (dock.classList.contains('is-help') && !dock.contains(e.target)) setHelp(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && dock.classList.contains('is-help')) { setHelp(false); help.focus(); }
  });

  frame();
})();
