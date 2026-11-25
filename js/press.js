/* ==== press-data.js ==== */
window.TESWAY_PRESS = [
  {
    outlet: 'Electrek',
    mark: 'electrek',
    kind: 'electrek',
    url: 'electrek.co/tesway-x1-review',
    tag: 'Review',
    title: 'TESWAY X1 Dual-Drive review: the e-bike that made range anxiety disappear',
    date: 'Mar 2026',
    lead: 'Range anxiety simply',
    hl: 'never showed up.',
    img: 'Images/hero-trail.jpg'
  },
  {
    outlet: 'WIRED',
    mark: 'WIRED',
    kind: 'wired',
    url: 'wired.com/gear/best-ebikes',
    tag: 'Gear',
    title: 'The best fat-tire e-bikes we tested this year, from city to campsite',
    date: 'Jan 2026',
    lead: 'Composed off-road.',
    hl: 'Easy every day.',
    img: 'Images/story-camp.jpg'
  },
  {
    outlet: 'Forbes',
    mark: 'Forbes',
    kind: 'forbes',
    url: 'forbes.com/tesway-multi-purpose',
    tag: 'Business',
    title: 'Why TESWAY is betting on one e-bike for work, weekends and everything between',
    date: 'Nov 2025',
    lead: 'One e-bike for work',
    hl: 'and every weekend.',
    img: 'Images/story-delivery.jpg'
  },
  {
    outlet: 'Outside',
    mark: 'OUTSIDE',
    kind: 'outside',
    url: 'outsideonline.com/ebike-test',
    tag: 'Field test',
    title: 'We took the TESWAY Trail Pro off the pavement. It never asked to go back',
    date: 'Sep 2025',
    lead: 'Built for the trailhead,',
    hl: 'at home in town.',
    img: 'Images/hero-family.jpg'
  },
  {
    outlet: 'GQ',
    mark: 'GQ',
    kind: 'gq',
    url: 'gq.com/style/ebikes',
    tag: 'Style',
    title: 'The rare e-bike that looks as good outside a café as it does covered in dust',
    date: 'Jul 2025',
    lead: 'Clean lines.',
    hl: 'Zero fuss.',
    img: 'Images/story-family.jpg'
  },
  {
    outlet: 'The Verge',
    mark: 'THE VERGE',
    kind: 'verge',
    url: 'theverge.com/ebike-review',
    tag: 'Tech',
    title: 'TESWAY’s dual-motor e-bike is the most fun we’ve had on two wheels this year',
    date: 'May 2025',
    lead: 'Two motors,',
    hl: 'zero hesitation.',
    img: 'Images/scenes/scene-fishing.jpg'
  },
  {
    outlet: 'Bicycling',
    mark: 'Bicycling',
    kind: 'bicycling',
    url: 'bicycling.com/tesway-trail',
    tag: 'Ride test',
    title: 'Fat tires, real torque: a long weekend on the TESWAY Trail Pro',
    date: 'Mar 2025',
    lead: 'Real torque where',
    hl: 'the trail gets real.',
    img: 'Images/scenes/scene-hunting.jpg'
  },
  {
    outlet: 'TechCrunch',
    mark: 'TechCrunch',
    kind: 'techcrunch',
    url: 'techcrunch.com/tesway',
    tag: 'Startups',
    title: 'TESWAY wants one e-bike to replace the second car on the farm and in the city',
    date: 'Jan 2025',
    lead: 'The second car',
    hl: 'just got replaced.',
    img: 'Images/scenes/scene-farm.jpg'
  }
];

/* ==== press.js ==== */
(function () {
  var data = window.TESWAY_PRESS;
  var box = document.getElementById('pressBox');
  var pick = document.getElementById('pressPick');
  var stage = document.getElementById('pressStage');
  if (!data || !box || !pick || !stage) return;

  var DURATION = 5000;
  var PULL = 700;
  var n = data.length;
  var REST = [[0, 0, -2], [1.4, 0.8, 4], [-1.5, 1.4, -6.5], [2.1, 2, 8]];
  var REST_M = [[0, 0, -2], [3.85, 0.9, 5.5], [-3.6, 1.6, -8], [1.2, 2.4, 10]];
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobile = window.matchMedia('(max-aspect-ratio: 999/1000)');
  var arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  var lock = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg>';
  function pad(v) { return String(v).padStart(2, '0'); }
  function mark(d) { return '<span class="press__mark press__mark--' + d.kind + '">' + d.mark + '</span>'; }
  function rest(depth) {
    var list = mobile.matches ? REST_M : REST;
    var r = list[Math.min(depth, list.length - 1)];
    return 'translate3d(' + r[0] + 'em, ' + r[1] + 'em, ' + (-depth * 2.5) + 'em) rotate(' + r[2] + 'deg)';
  }

  var ctl = '<span class="pcard__ctl"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 4 6 8l4 4"/></svg>' +
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4"/></svg>' +
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12.5 8a4.5 4.5 0 1 1-1.3-3.2M12.5 3v2.5H10"/></svg></span>';
  function side(k) {
    var items = [1, 2, 3].map(function (s) {
      var o = data[(k + s) % n];
      return '<span class="pcard__hit"><i><img src="' + o.img + '" alt="" loading="lazy" decoding="async"></i>' +
        '<span><b>' + pad(s) + '</b>' + o.title + '</span></span>';
    }).join('');
    return '<span class="pcard__side"><small>Most read</small>' + items + '<span class="pcard__ad">TESWAY X1<b>Ride the test →</b></span></span>';
  }

  function card(d, k) {
    return '<div class="pcard" aria-hidden="true">' +
      '<span class="pcard__bar"><i></i><i></i><i></i>' + ctl + '<em>' + lock + d.url + '</em></span>' +
      '<span class="pcard__nav">' + mark(d) + '<span class="pcard__menu"><i></i><i></i><i></i></span><b>Subscribe</b></span>' +
      '<span class="pcard__body">' +
        '<small class="pcard__tag">' + d.tag + '</small>' +
        '<strong class="pcard__title">' + d.title + '</strong>' +
        '<span class="pcard__by"><i class="pcard__ava"></i>By ' + d.outlet + ' staff · ' + d.date + ' · 6 min read</span>' +
        '<span class="pcard__img"><img src="' + d.img + '" alt="" loading="lazy" decoding="async"><b>TESWAY</b></span>' +
        '<span class="pcard__dek">“' + d.lead + ' ' + d.hl + '” Our editors spent weeks with the bike on daily commutes and long weekend rides.</span>' +
        '<span class="pcard__lines"><i></i><i></i><i></i></span>' +
        side(k) +
      '</span><i class="pcard__glare"></i></div>';
  }

  box.style.setProperty('--press-dur', DURATION + 'ms');
  box.style.setProperty('--press-pull', PULL + 'ms');
  pick.innerHTML =
    '<div class="press__logos" role="tablist" aria-label="Press coverage">' + data.map(function (d) {
      return '<button class="press__tab" type="button" role="tab" aria-label="' + d.outlet + '">' + mark(d) + '<i class="press__bar"></i></button>';
    }).join('') + '</div>' +
    '<div class="press__foot"><p class="press__meta" aria-live="polite"></p>' +
    '<a class="hbtn press__link" href="#press">Read article' + arrow + '</a></div>';
  stage.innerHTML = '<i class="press__cross" aria-hidden="true"></i>' +
    '<div class="press__tilt"><div class="press__cards">' + data.map(card).join('') + '</div></div>';

  var cards = Array.prototype.slice.call(stage.querySelectorAll('.pcard'));
  var btns = Array.prototype.slice.call(pick.querySelectorAll('.press__tab'));
  var meta = pick.querySelector('.press__meta');
  var pile = stage.querySelector('.press__cards');
  var order = data.map(function (d, k) { return k; });
  var current = -1, timer = 0, hold = false, seen = false;

  function stack(skip) {
    order.forEach(function (k, depth) {
      var c = cards[k];
      c.style.transform = rest(depth);
      c.style.opacity = depth < REST.length ? 1 : 0;
      c.classList.toggle('is-on', depth === 0);
      if (k !== skip) c.style.zIndex = n - depth;
    });
  }

  function pull(k, from) {
    var c = cards[k];
    c.style.setProperty('--from', from);
    c.classList.remove('is-pull');
    void c.offsetWidth;
    c.classList.add('is-pull');
    setTimeout(function () { c.style.zIndex = n + 1; }, PULL * 0.42);
  }

  function set(i) {
    i = (i + n) % n;
    if (i === current) return;
    var first = current < 0;
    var from = first ? '' : rest(order.indexOf(i));
    current = i;
    order = order.filter(function (k) { return k !== i; });
    order.unshift(i);
    stack(first || calm.matches ? -1 : i);
    if (!first && !calm.matches) pull(i, from);
    btns.forEach(function (b, k) {
      b.classList.toggle('is-on', k === i);
      b.setAttribute('aria-selected', k === i);
    });
    meta.innerHTML = '<b>' + pad(i + 1) + ' / ' + pad(n) + '</b>' + data[i].outlet + ' · ' + data[i].tag + '<span class="press__date"> · ' + data[i].date + '</span>';
    run();
  }

  cards.forEach(function (c) {
    c.addEventListener('animationend', function () { c.classList.remove('is-pull'); });
  });
  mobile.addEventListener('change', function () { stack(-1); });

  function run() {
    clearTimeout(timer);
    box.classList.remove('is-run');
    if (calm.matches || hold || !seen) return;
    void box.offsetWidth;
    box.classList.add('is-run');
    timer = setTimeout(function () { set(current + 1); }, DURATION);
  }

  btns.forEach(function (b, i) { b.addEventListener('click', function () { set(i); }); });
  pile.addEventListener('click', function () { set(current + 1); });

  function pause(v) { hold = v; run(); }
  box.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') pause(true); });
  box.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') pause(false); });
  box.addEventListener('focusin', function () { pause(true); });
  box.addEventListener('focusout', function (e) { if (!box.contains(e.relatedTarget)) pause(false); });

  stage.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse' || calm.matches) return;
    var r = stage.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    stage.classList.add('is-tilt');
    stage.style.setProperty('--ry', ((x - 0.5) * 18).toFixed(2) + 'deg');
    stage.style.setProperty('--rx', ((0.5 - y) * 14).toFixed(2) + 'deg');
    stage.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
    stage.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
  });
  stage.addEventListener('pointerleave', function () {
    stage.classList.remove('is-tilt');
    stage.style.setProperty('--rx', '0deg');
    stage.style.setProperty('--ry', '0deg');
  });

  var x0 = null;
  stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) set(current + (dx < 0 ? 1 : -1));
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      seen = entries[0].isIntersecting;
      run();
    }, { threshold: 0.3 }).observe(box);
  } else seen = true;

  set(0);
})();
