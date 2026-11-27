/* ==== about-stage.js · scroll → smoothed progress p → HTML overlays (3D world reads the same p) ==== */
(function () {
  var sec = document.getElementById('about');
  if (!sec) return;
  var pin = sec.querySelector('.astage__pin');
  var chap = document.getElementById('aboutChap');
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var S = { hero: $('top'), map: $('reach'), time: $('story'), craft: $('craft'), voice: $('reviews') };
  var vTop = S.voice.querySelector('.avoice__top');
  var tHead = S.time.querySelector('.atime__head');
  var tCard = document.getElementById('timeCard');
  var vRows = Array.prototype.slice.call(S.voice.querySelectorAll('.avoice__row'));

  /* one timeline shared with the 3D world (js/a3d reads window.TESWAY_T) */
  var T = window.TESWAY_T = {
    hero: [0, 1.6], map: [1.6, 4.6], regions: [1.9, 0.6], dive: [4.6, 6], ride: [6, 11],
    third: [11, 11.8], tech: [11.8, 0.6], out: [14.1, 14.5], total: 15.7
  };
  var TOTAL = T.total;
  var CH = [
    { id: 'top', label: 'Intro', p: 0, from: 0 },
    { id: 'reach', label: 'Global', p: 2, from: 1.2 },
    { id: 'story', label: 'Story', p: 6.25, from: 4.6 },
    { id: 'craft', label: 'Craft', p: 12.05, from: 11 },
    { id: 'reviews', label: 'Voices', p: TOTAL, from: 14.3 }
  ];
  var stage = { p: 0, T: T };
  var rem = 16, U = 1, cur = 0, goal = 0, raf = 0, live = {}, chapOn = -1;

  chap.innerHTML = CH.map(function (c, i) { return '<button type="button" data-i="' + i + '"><span>' + c.label + '</span><i></i></button>'; }).join('');
  var chapBtns = Array.prototype.slice.call(chap.children);

  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function seg(p, a, b) { return cl((p - a) / (b - a)); }
  function io(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function eo(t) { return 1 - Math.pow(1 - t, 3); }
  function px(v) { return v.toFixed(1) + 'px'; }

  function scene(el, id, show, on) {
    el.classList.toggle('is-show', show);
    el.classList.toggle('is-live', on);
    if (live[id] === on) return;
    live[id] = on;
    document.dispatchEvent(new CustomEvent('ascene', { detail: { id: id, on: on } }));
  }

  function fade(el, a, b, c, d, p, lift) {
    var i = io(seg(p, a, b)), o = io(seg(p, c, d));
    el.style.opacity = (i * (1 - o)).toFixed(3);
    el.style.transform = 'translate3d(0,' + px(((1 - i) - o) * rem * (lift || 1.5)) + ',0)';
    return i * (1 - o);
  }

  function apply(p) {
    var h = 1 - seg(p, 0.04, 0.4);
    S.hero.style.opacity = h.toFixed(3);
    S.hero.style.transform = 'translate3d(0,' + px(-(1 - h) * rem * 2) + ',0)';
    scene(S.hero, 'hero', h > 0, p < 0.3);

    var m = fade(S.map, 1.25, 1.65, 4.45, 4.75, p);
    scene(S.map, 'map', m > 0, p > 1.6 && p < 4.6);

    var t = fade(S.time, 5.7, 6.05, 10.75, 11.05, p);
    scene(S.time, 'time', t > 0, p > 6 && p < 10.9);
    if (t > 0) {
      tHead.style.opacity = (1 - io(seg(p, 6.7, 7.1))).toFixed(3);
      var tc = io(seg(p, 6.85, 7.2));
      tCard.style.opacity = tc.toFixed(3);
      tCard.style.visibility = tc > 0 ? 'visible' : 'hidden';
    }

    var c = fade(S.craft, 11.45, 11.8, 14.1, 14.4, p);
    scene(S.craft, 'craft', c > 0, p > 11.6 && p < 14.3);

    var vi = eo(seg(p, 14.5, 15));
    vTop.style.opacity = vi.toFixed(3);
    vTop.style.transform = 'translate3d(0,' + px((1 - vi) * rem * 2.5) + ',0)';
    vRows.forEach(function (r, k) {
      var e = eo(seg(p, 14.55 + k * 0.12, 15.05 + k * 0.08));
      r.style.opacity = e.toFixed(3);
      r.style.transform = 'translate3d(' + ((1 - e) * (k ? -16 : 16)).toFixed(2) + '%,0,0)';
    });
    scene(S.voice, 'voice', p > 14.5, p > 14.8);

    stage.p = p;
    var ci = 0;
    CH.forEach(function (ch, i) { if (p >= ch.from) ci = i; });
    if (ci !== chapOn) {
      chapOn = ci;
      chapBtns.forEach(function (b, i) { b.classList.toggle('is-on', i === ci); b.setAttribute('aria-current', i === ci ? 'step' : 'false'); });
    }
  }

  function read() { return Math.max(0, Math.min(TOTAL, -sec.getBoundingClientRect().top / U)); }

  /* frame-rate independent damping; the 3D loop calls step() so DOM and WebGL share one frame */
  var lastNow = 0, shownP = -1;
  stage.step = function (now) {
    var dt = lastNow ? Math.min(0.05, (now - lastNow) / 1000) : 0.016;
    lastNow = now;
    cur += (goal - cur) * (calm ? 1 : 1 - Math.exp(-dt * 6.5));
    if (Math.abs(goal - cur) < 0.0002) cur = goal;
    if (cur !== shownP) { shownP = cur; apply(cur); }
    return cur !== goal;
  };
  function tick(now) { raf = stage.step(now) && !stage.ext ? requestAnimationFrame(tick) : 0; }
  /* once the pin starts to leave, the reviews must already be fully settled: skip the smoothing lag */
  function kick() {
    goal = read();
    if (goal >= TOTAL && cur < TOTAL) { cur = goal; shownP = cur; apply(cur); }
    if (!raf && !stage.ext) raf = requestAnimationFrame(tick);
  }

  function size() {
    rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    U = pin.clientHeight || innerHeight;
    sec.style.height = Math.round((TOTAL + 1) * U) + 'px';
    goal = cur = read();
    shownP = cur;
    apply(cur);
  }

  function jump(p) {
    var top = sec.getBoundingClientRect().top + scrollY;
    scrollTo({ top: Math.round(top + p * U) + 1, behavior: calm ? 'auto' : 'smooth' });
  }

  chap.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (b) jump(CH[Number(b.dataset.i)].p);
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var ch = CH.filter(function (x) { return x.id === id; })[0];
    if (!ch) return;
    e.preventDefault();
    jump(ch.p);
  });

  stage.jump = jump;
  window.TeswayStage = stage;
  addEventListener('scroll', kick, { passive: true });
  var rw = innerWidth, rt = 0;
  addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (innerWidth !== rw || Math.abs(pin.clientHeight - U) > 120) { rw = innerWidth; size(); } }, 150);
  });
  size();
})();
