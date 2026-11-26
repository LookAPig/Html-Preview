/* ==== about-stage.js · scroll → smoothed progress → every scene on one sticky stage ==== */
(function () {
  var sec = document.getElementById('about');
  if (!sec) return;
  var pin = sec.querySelector('.astage__pin');
  var bar = document.getElementById('aboutBar');
  var chap = document.getElementById('aboutChap');
  var dots = document.getElementById('aboutDots');
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var S = { hero: $('top'), map: $('reach'), time: $('story'), craft: $('craft'), voice: $('reviews') };
  var heroBox = S.hero.querySelector('.hero');
  var crTop = S.craft.querySelector('.acraft__top');
  var crCards = Array.prototype.slice.call(S.craft.querySelectorAll('.acard'));
  var vTop = S.voice.querySelector('.avoice__top');
  var vRows = Array.prototype.slice.call(S.voice.querySelectorAll('.avoice__row'));

  var TOTAL = 11.4, STORY = [3.55, 8.2];
  var CH = [
    { id: 'top', label: 'Intro', p: 0, from: 0 },
    { id: 'reach', label: 'Global', p: 1.6, from: 0.9 },
    { id: 'story', label: 'Story', p: 3.9, from: 2.5 },
    { id: 'craft', label: 'Craft', p: 9.5, from: 8.6 },
    { id: 'reviews', label: 'Voices', p: TOTAL, from: 10.3 }
  ];
  var stage = { p: 0 };
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

  function apply(p) {
    var H = U;

    var ho = io(seg(p, 0.12, 1));
    heroBox.style.transform = 'translate3d(0,' + px(-ho * H * 0.06) + ',0) scale(' + (1 - ho * 0.14).toFixed(4) + ')';
    heroBox.style.borderRadius = px(ho * rem * 1.25);
    heroBox.style.setProperty('--fade', (1 - seg(p, 0.04, 0.4)).toFixed(3));
    heroBox.style.setProperty('--py', px(ho * H * 0.12));
    S.hero.style.opacity = (1 - seg(p, 0.55, 0.92)).toFixed(3);
    scene(S.hero, 'hero', p < 0.92, p < 0.5);

    var mi = eo(seg(p, 0.92, 1.4)), mo = io(seg(p, 2.3, 2.65));
    S.map.style.opacity = (mi * (1 - mo)).toFixed(3);
    S.map.style.transform = 'translate3d(0,' + px((1 - mi) * rem * 3 - mo * rem * 2) + ',0)';
    scene(S.map, 'map', p > 0.92 && p < 2.65, p > 0.95 && p < 2.45);

    var ti = io(seg(p, 3.2, 3.6)), to = io(seg(p, 8.1, 8.35));
    S.time.style.opacity = (ti * (1 - to)).toFixed(3);
    S.time.style.transform = 'translate3d(0,' + px((1 - ti) * rem * 2 - to * rem * 2) + ',0)';
    scene(S.time, 'time', p > 3.2 && p < 8.35, p > 3.5 && p < 8.1);

    var ci = eo(seg(p, 8.7, 9.3)), co = io(seg(p, 10, 10.45));
    crTop.style.opacity = ci.toFixed(3);
    crTop.style.transform = 'translate3d(0,' + px((1 - ci) * rem * 2.5) + ',0)';
    crCards.forEach(function (c, k) {
      var e = eo(seg(p, 8.75 + k * 0.12, 9.45 + k * 0.12));
      c.style.opacity = Math.min(1, e * 2).toFixed(3);
      c.style.transform = 'translate3d(0,' + px((1 - e) * rem * 2) + ',0) rotateX(' + ((1 - e) * 72).toFixed(2) + 'deg)';
    });
    dots.style.opacity = (seg(p, 8.45, 8.85) * (1 - seg(p, 10, 10.4))).toFixed(3);
    S.craft.style.opacity = (1 - co).toFixed(3);
    S.craft.style.transform = 'translate3d(0,' + px(-co * H * 0.08) + ',0) scale(' + (1 - co * 0.04).toFixed(4) + ')';
    scene(S.craft, 'craft', p > 8.7 && p < 10.45, p > 8.75 && p < 10.2);

    var vi = eo(seg(p, 10.25, 10.85));
    vTop.style.opacity = vi.toFixed(3);
    vTop.style.transform = 'translate3d(0,' + px((1 - vi) * rem * 2.5) + ',0)';
    vRows.forEach(function (r, k) {
      var e = eo(seg(p, 10.35 + k * 0.15, 11.1 + k * 0.15));
      r.style.opacity = e.toFixed(3);
      r.style.transform = 'translate3d(' + ((1 - e) * (k ? -16 : 16)).toFixed(2) + '%,0,0)';
    });
    scene(S.voice, 'voice', p > 10.25, p > 10.6);

    stage.p = p;
    if (window.Tesway3D) window.Tesway3D.set(p);
    bar.style.transform = 'scaleX(' + (p / TOTAL).toFixed(4) + ')';
    var c = 0;
    CH.forEach(function (ch, i) { if (p >= ch.from) c = i; });
    if (c !== chapOn) {
      chapOn = c;
      chapBtns.forEach(function (b, i) { b.classList.toggle('is-on', i === c); b.setAttribute('aria-current', i === c ? 'step' : 'false'); });
    }
  }

  function read() { return Math.max(0, Math.min(TOTAL, -sec.getBoundingClientRect().top / U)); }

  /* frame-rate independent damping; the 3D loop calls step() so DOM and WebGL share one frame */
  var lastNow = 0, shownP = -1;
  stage.step = function (now) {
    var dt = lastNow ? Math.min(0.05, (now - lastNow) / 1000) : 0.016;
    lastNow = now;
    cur += (goal - cur) * (calm ? 1 : 1 - Math.exp(-dt * 7.5));
    if (Math.abs(goal - cur) < 0.0003) cur = goal;
    if (cur !== shownP) { shownP = cur; apply(cur); }
    return cur !== goal;
  };
  function tick(now) {
    raf = stage.step(now) && !stage.ext ? requestAnimationFrame(tick) : 0;
  }
  function kick() { goal = read(); if (!raf && !stage.ext) raf = requestAnimationFrame(tick); }

  function size() {
    rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    U = pin.clientHeight || innerHeight;
    sec.style.height = Math.round((TOTAL + 1) * U) + 'px';
    goal = cur = read();
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
    var c = CH.filter(function (ch) { return ch.id === id; })[0];
    if (!c) return;
    e.preventDefault();
    jump(c.p);
  });

  stage.story = function (u) { jump(STORY[0] + u * (STORY[1] - STORY[0])); };
  window.TeswayStage = stage;
  addEventListener('scroll', kick, { passive: true });
  var rw = innerWidth, rt = 0;
  addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (innerWidth !== rw || Math.abs(pin.clientHeight - U) > 120) { rw = innerWidth; size(); } }, 150);
  });
  size();
})();
