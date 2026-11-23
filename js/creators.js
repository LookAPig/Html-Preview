(function () {
  var data = window.TESWAY_CREATORS;
  var icons = window.TESWAY_PF;
  var box = document.getElementById('creatorsBox');
  if (!data || !icons || !box) return;

  var people = data.creators;
  var OUT = 360;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  function pad(v) { return String(v).padStart(2, '0'); }
  function pf(c, cls) { return '<i class="' + cls + ' is-' + c.platform + '">' + icons[c.platform].svg + '</i>'; }

  function cardsOf(c) {
    var p = icons[c.platform];
    return c.videos.map(function (v, k) {
      return '<button class="cr__card" type="button" style="--k:' + k + '" aria-label="Play: ' + v[0] + '">' +
        '<span class="cr__thumb"><img src="' + v[1] + '" alt="" loading="lazy" decoding="async">' +
          '<span class="cr__tag">' + p.svg + p.label + '</span>' +
          '<span class="cr__play">' + icons.play + '</span><span class="cr__dur">' + v[2] + '</span></span>' +
        '<span class="cr__info"><strong>' + v[0] + '</strong>' +
          '<small><b>' + c.name + '</b> · ' + v[3] + ' views</small></span></button>';
    }).join('');
  }

  box.innerHTML =
    '<div class="cr__people" role="tablist" aria-label="Creators">' + people.map(function (c) {
      return '<button class="cr__person" type="button" role="tab" aria-controls="crTrack" aria-label="' + c.name + ' videos">' +
        '<span class="cr__ava"><b>' + c.short + '</b>' + pf(c, 'cr__pf') + '</span>' +
        '<span class="cr__name">' + c.name + '</span><small>' + c.subs + ' followers</small></button>';
    }).join('') + '</div>' +
    '<div class="cr__track" id="crTrack" role="tabpanel" aria-live="polite"></div>' +
    '<div class="cr__ctrl"><b class="cr__now">01</b><span class="cr__bar"><i></i></span>' +
      '<small class="cr__total">01</small>' +
      '<div class="hero__arrows cr__arrows">' +
        '<button type="button" data-dir="-1" aria-label="Previous videos"><span>&#8592;</span></button>' +
        '<button type="button" data-dir="1" aria-label="Next videos"><span>&#8594;</span></button>' +
      '</div></div>';

  var list = box.querySelector('.cr__people');
  var avatars = Array.prototype.slice.call(list.children);
  var track = box.querySelector('.cr__track');
  var now = box.querySelector('.cr__now');
  var total = box.querySelector('.cr__total');
  var bar = box.querySelector('.cr__bar i');
  var arrows = box.querySelectorAll('.cr__arrows button');
  var who = -1;
  var swapT = 0;
  var ticking = false;

  function cards() { return track.children; }
  function step() { var c = cards(); return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : track.clientWidth; }
  function first() { return Math.max(0, Math.min(cards().length - 1, Math.round(track.scrollLeft / step()))); }

  function update() {
    ticking = false;
    var n = cards().length;
    if (!n) return;
    var max = track.scrollWidth - track.clientWidth;
    var p = max > 0 ? track.scrollLeft / max : 1;
    var visible = max > 0 ? Math.round(track.clientWidth / step()) : n;
    var i = p > 0.995 ? n : Math.min(n, first() + visible);
    bar.style.transform = 'scaleX(' + Math.max(0.04, i / n) + ')';
    now.textContent = pad(i);
    total.textContent = pad(n);
    arrows[0].disabled = track.scrollLeft < 4;
    arrows[1].disabled = track.scrollLeft > max - 4;
  }

  function fill(c) {
    track.innerHTML = cardsOf(people[c]);
    track.scrollLeft = 0;
    track.classList.remove('is-out');
    if (!calm.matches) {
      track.classList.remove('is-in');
      void track.offsetWidth;
      track.classList.add('is-in');
    }
    update();
  }

  function pick(c) {
    if (c === who) return;
    var firstRun = who < 0;
    who = c;
    avatars.forEach(function (a, k) {
      a.classList.toggle('is-on', k === c);
      a.setAttribute('aria-selected', k === c);
    });
    var a = avatars[c];
    list.scrollTo({ left: a.offsetLeft - list.offsetLeft - (list.clientWidth - a.offsetWidth) / 2, behavior: firstRun ? 'auto' : 'smooth' });
    clearTimeout(swapT);
    if (firstRun || calm.matches) return fill(c);
    track.classList.remove('is-in');
    track.classList.add('is-out');
    swapT = setTimeout(function () { fill(c); }, OUT);
  }

  track.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);

  avatars.forEach(function (a, c) { a.addEventListener('click', function () { pick(c); }); });
  arrows.forEach(function (b) {
    b.addEventListener('click', function () {
      track.scrollBy({ left: step() * Number(b.dataset.dir), behavior: 'smooth' });
    });
  });
  track.addEventListener('click', function (e) {
    var card = e.target.closest('.cr__card');
    if (!card || !window.TeswayPlayer) return;
    var v = people[who].videos[Array.prototype.indexOf.call(cards(), card)];
    window.TeswayPlayer.open({ name: people[who].name, title: v[0], poster: v[1], src: data.src });
  });

  pick(0);
})();
