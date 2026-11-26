/* ==== about-time.js ==== */
(function () {
  var track = document.getElementById('timeTrack');
  var list = window.TESWAY_ABOUT && window.TESWAY_ABOUT.time;
  if (!track || !list) return;

  var sec = track.closest('.abt');
  var view = track.parentNode;
  var ghost = sec.querySelector('.abt__ghost');
  var pc = matchMedia('(min-aspect-ratio: 1/1)');

  track.innerHTML = list.map(function (t, i) {
    return '<li class="abt__item" style="--i:' + i + '">' +
      '<span class="abt__dot" aria-hidden="true"></span>' +
      '<b class="abt__y">' + t.year + '</b>' +
      '<figure class="abt__img"><img src="' + t.img + '" alt="" loading="lazy" decoding="async"></figure>' +
      '<h3>' + t.title + '</h3><p>' + t.text + '</p></li>';
  }).join('');

  var items = Array.prototype.slice.call(track.children);
  var travel = 0, ticking = false, cur = -1;

  function layout() {
    if (pc.matches) {
      travel = Math.max(0, track.offsetWidth - view.clientWidth);
      sec.style.height = (parseFloat(getComputedStyle(sec).paddingTop) + innerHeight + travel) + 'px';
    } else {
      travel = 0;
      sec.style.height = '';
      track.style.transform = '';
    }
    update();
  }

  function setYear(i) {
    if (i === cur) return;
    cur = i;
    ghost.textContent = list[Math.max(0, i)].year;
    ghost.classList.remove('is-swap');
    void ghost.offsetWidth;
    ghost.classList.add('is-swap');
  }

  function update() {
    ticking = false;
    var line, size, at = -1;
    if (pc.matches) {
      var start = sec.getBoundingClientRect().top + parseFloat(getComputedStyle(sec).paddingTop);
      var p = travel ? Math.max(0, Math.min(1, -start / travel)) : 0;
      track.style.transform = 'translate3d(' + (-p * travel).toFixed(1) + 'px,0,0)';
      var from = items[0].offsetLeft + 12;
      line = p * travel + from + (view.clientWidth * 0.42 - from) * p;
      size = track.offsetWidth;
    } else {
      line = innerHeight * 0.62 - track.getBoundingClientRect().top;
      size = track.offsetHeight;
    }
    items.forEach(function (it, i) {
      var dot = pc.matches ? it.offsetLeft + 6 : it.offsetTop + 12;
      var past = dot <= line;
      it.classList.toggle('is-past', past);
      if (past) at = i;
    });
    items.forEach(function (it, i) { it.classList.toggle('is-now', i === at); });
    track.style.setProperty('--fill', Math.max(0, Math.min(1, line / size)).toFixed(4));
    setYear(Math.max(0, at));
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', layout);
  pc.addEventListener('change', layout);
  layout();
})();
