(function () {
  var hero = document.getElementById('top');
  var root = document.getElementById('heroSlides');
  var bar = document.getElementById('heroCtrl');
  var data = window.TESWAY_HERO;
  var notice = window.TESWAY_NOTICE;
  if (!hero || !root || !data || !window.TeswayHeroBuild) return;

  window.TeswayHeroBuild(root, bar, data.slides);
  var slides = root.querySelectorAll('.hs');
  var dots = bar.querySelectorAll('.hero__dots button');
  var count = bar.querySelector('.hero__count b');
  var video = root.querySelector('video');
  var desktop = window.matchMedia('(min-aspect-ratio: 1/1)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = -1, timer = null, offscreen = false;

  function syncVideo() {
    if (!video || reduce || !desktop.matches) return;
    var active = slides[index].contains(video);
    if (active && !video.src) {
      video.src = video.dataset.src;
      video.addEventListener('playing', function () { video.classList.add('is-playing'); });
    }
    if (!video.src) return;
    if (active && !offscreen) video.play().catch(function () {});
    else video.pause();
  }

  function go(i) {
    var n = slides.length;
    i = (i + n) % n;
    if (i === index) return;
    if (index > -1) {
      slides[index].classList.remove('is-on');
      dots[index].classList.remove('is-on');
      dots[index].removeAttribute('aria-current');
    }
    index = i;
    slides[i].classList.add('is-on');
    dots[i].classList.add('is-on');
    dots[i].setAttribute('aria-current', 'true');
    count.textContent = String(i + 1).padStart(2, '0');
    syncVideo();
    restart();
  }

  function restart() {
    clearTimeout(timer);
    for (var i = 0; i < dots.length; i++) dots[i].classList.remove('is-run');
    if (reduce || offscreen || document.hidden || drag) return;
    dots[index].style.setProperty('--cd', data.interval + 'ms');
    void dots[index].offsetWidth;
    dots[index].classList.add('is-run');
    timer = setTimeout(function () { go(index + 1); }, data.interval);
  }

  dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
  bar.querySelectorAll('[data-dir]').forEach(function (b) {
    b.addEventListener('click', function () { go(index + Number(b.dataset.dir)); });
  });
  hero.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(index + 1);
    if (e.key === 'ArrowLeft') go(index - 1);
  });
  document.addEventListener('visibilitychange', restart);
  desktop.addEventListener('change', syncVideo);

  var drag = null, moved = false;
  hero.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 || e.target.closest('.hero__ctrl')) return;
    drag = { x: e.clientX, y: e.clientY, dx: 0, id: e.pointerId };
    moved = false;
    restart();
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x;
    if (!moved && Math.abs(drag.dx) > 8 && Math.abs(drag.dx) > Math.abs(e.clientY - drag.y)) {
      moved = true;
      hero.classList.add('is-dragging');
    }
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = drag.dx;
    drag = null;
    hero.classList.remove('is-dragging');
    if (moved && Math.abs(dx) > Math.min(80, hero.clientWidth * 0.12)) go(index + (dx < 0 ? 1 : -1));
    else restart();
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  hero.addEventListener('click', function (e) {
    if (!moved) return;
    e.preventDefault();
    e.stopPropagation();
    moved = false;
  }, true);
  hero.addEventListener('dragstart', function (e) { e.preventDefault(); });

  var lefts = root.querySelectorAll('[data-left]');
  var end = notice ? new Date(notice.deadline).getTime() : 0;
  function pad(v) { return String(v).padStart(2, '0'); }
  function tick() {
    var s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    var text = s
      ? Math.floor(s / 86400) + 'd ' + pad(Math.floor(s / 3600) % 24) + 'h ' +
        pad(Math.floor(s / 60) % 60) + 'm ' + pad(s % 60) + 's'
      : '0d 00h 00m 00s';
    lefts.forEach(function (el) { el.textContent = text; });
  }
  if (lefts.length && end) {
    tick();
    setInterval(tick, 1000);
  }

  go(0);

  var ticking = false;
  function render() {
    ticking = false;
    var h = hero.offsetHeight;
    var y = Math.min(window.scrollY, h);
    if (!reduce) {
      hero.style.setProperty('--py', (y * 0.35).toFixed(1) + 'px');
      hero.style.setProperty('--fade', (1 - y / (h * 0.8)).toFixed(3));
    }
    var off = y > h * 0.6;
    if (off !== offscreen) {
      offscreen = off;
      syncVideo();
      restart();
    }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  }, { passive: true });
})();
