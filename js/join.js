/* ==== join-data.js ==== */
window.TESWAY_JOIN = {
  eyebrow: 'Join the crew',
  title: 'Join Our <em>Community</em>',
  sub: 'Connect with fellow riders, share your rides and be first to hear TESWAY news and events.',
  tag: '#RideTESWAY',
  cols: [
    { dir: -1, photos: [
      ['Images/hero-trail.jpg', '4 / 5'], ['Images/story-delivery.jpg', '1'],
      ['Images/scenes/scene-hunting.jpg', '4 / 5'], ['Images/hero-family-m.jpg', '1']
    ] },
    { dir: 1, photos: [
      ['Images/story-camp.jpg', '1'], ['Images/story-family.jpg', '4 / 5'],
      ['Images/scenes/scene-farm.jpg', '1'], ['Images/brand-beyond.jpg', '4 / 5']
    ] },
    { dir: -1, photos: [
      ['Images/scenes/scene-fishing.jpg', '4 / 5'], ['Images/hero-family.jpg', '1'],
      ['Images/hero-trail-m.jpg', '4 / 5'], ['Images/quiz-banner.jpg', '1']
    ] }
  ],
  socials: [
    { name: 'Instagram', href: '#join', icon: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>' },
    { name: 'YouTube', href: '#join', icon: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.2 5 2.8-5 2.8z"/>' },
    { name: 'Facebook', href: '#join', icon: '<path d="M14.5 8.5h2V5h-2.5a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5l.5-3.5h-3V9a.5.5 0 0 1 .5-.5z"/>' },
    { name: 'TikTok', href: '#join', icon: '<path d="M14 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3"/><path d="M14 3.5c.4 2.6 2.2 4.3 5 4.5"/>' }
  ],
  stats: [
    { n: 30, suf: 'K+', label: 'Active riders', icon: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19c.9-3 3-4.6 5.5-4.6s4.6 1.6 5.5 4.6"/><path d="M15.5 5.6a3 3 0 0 1 0 5.8M17.5 14.6c1.5.6 2.5 2 3 4.4"/>' },
    { n: 2000, suf: '+', label: 'Group rides a year', icon: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>' },
    { n: 35, suf: 'K+', label: 'Shared ride photos', icon: '<path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3v10H4z"/><circle cx="12" cy="13" r="3.2"/>' }
  ]
};

/* ==== join.js ==== */
(function () {
  var data = window.TESWAY_JOIN;
  var box = document.getElementById('joinBox');
  if (!data || !box) return;

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desk = window.matchMedia('(min-aspect-ratio: 1/1)');

  function svg(paths, draw) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><g class="ico-base">' + paths + '</g>' +
      (draw ? '<g class="ico-draw">' + paths.replace(/\/>/g, ' pathLength="1"/>') + '</g>' : '') + '</svg>';
  }

  function col(c) {
    return '<div class="join__col" style="--dir:' + c.dir + '">' + c.photos.map(function (p) {
      return '<span class="join__ph" style="aspect-ratio:' + p[1] + '"><img src="' + p[0] + '" alt="" loading="lazy" decoding="async"></span>';
    }).join('') + '</div>';
  }

  box.innerHTML =
    '<div class="join__copy">' +
      '<p class="eyebrow eyebrow--dot">' + data.eyebrow + '</p>' +
      '<h2>' + data.title + '</h2>' +
      '<p class="sec-sub">' + data.sub + '</p>' +
      '<div class="join__socials">' + data.socials.map(function (s) {
        return '<a class="hbtn hbtn--line join__social" href="' + s.href + '">' + svg(s.icon, false) + s.name + '</a>';
      }).join('') + '</div>' +
      '<ul class="join__stats">' + data.stats.map(function (s) {
        return '<li>' + svg(s.icon, true) + '<strong data-n="' + s.n + '" data-suf="' + s.suf + '">0' + s.suf + '</strong><span>' + s.label + '</span></li>';
      }).join('') + '</ul>' +
    '</div>' +
    '<div class="join__wall" aria-hidden="true"><div class="join__cols">' + data.cols.map(col).join('') + '</div>' +
      '<b class="join__tag">' + data.tag + '</b></div>';

  var ticking = false;
  function update() {
    ticking = false;
    var rect = box.getBoundingClientRect();
    var vh = window.innerHeight;
    if (rect.bottom < 0 || rect.top > vh) return;
    var p = (vh - rect.top) / (vh + rect.height);
    box.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
  }
  function onScroll() {
    if (ticking || calm.matches || !desk.matches) return;
    ticking = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  var nums = Array.prototype.slice.call(box.querySelectorAll('.join__stats strong'));
  function fmt(v) { return Math.round(v).toLocaleString('en-US'); }
  function count() {
    nums.forEach(function (el) {
      var to = Number(el.dataset.n), suf = el.dataset.suf;
      if (calm.matches) { el.textContent = fmt(to) + suf; return; }
      var t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, (t - t0) / 1600);
        el.textContent = fmt(to * (1 - Math.pow(1 - k, 3))) + suf;
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      count();
    }, { threshold: 0.4 });
    io.observe(box.querySelector('.join__stats'));
  } else count();
})();
