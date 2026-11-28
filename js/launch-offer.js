/* ==== launch-offer.js · offer card, countdown, add to cart and sticky deal bar ==== */
(function () {
  var K = window.TeswayPDP, L = window.TESWAY_LAUNCH;
  var $ = function (id) { return document.getElementById(id); };
  var card = $('lofCard');
  if (!K || !L || !card) return;
  var p = K.p, d = K.d, money = K.money, svg = K.svg, sw = K.sw;
  var save = p.was ? p.was - p.price : 0;
  var off = p.was ? Math.round(save / p.was * 100) : 0;
  var monthly = Math.ceil(p.price / d.apr.months);
  var color = p.colors[0];
  var parts = [['d', 'Days'], ['h', 'Hours'], ['m', 'Mins'], ['s', 'Secs']];

  card.innerHTML =
    '<div class="lof__hero"><p class="eyebrow">' + L.offer.eyebrow + '</p>' +
      '<h2>' + (save ? 'Save ' + money(save) : 'Launch price') + ' <em>this week</em></h2>' +
      '<div class="lof__cd">' + parts.map(function (x) {
        return '<p><b data-cd-part="' + x[0] + '">00</b><small>' + x[1] + '</small></p>';
      }).join('') + '</div>' +
      '<img class="lof__img" src="' + p.img + '.webp" alt="' + p.name + '" width="1152" height="864" loading="lazy" decoding="async"></div>' +
    '<div class="lof__buy">' +
      '<div class="lof__row"><h3>' + p.name + '</h3><p class="lof__rate">★ ' + p.rate + ' · ' + p.reviews + ' reviews</p></div>' +
      '<p class="lof__price"><b>' + money(p.price) + '</b>' + (p.was ? '<s>' + money(p.was) + '</s><i>-' + off + '%</i>' : '') + '</p>' +
      '<p class="lof__apr">or <b>' + money(monthly) + '/mo</b> for ' + d.apr.months + ' months with ' + d.apr.by + '</p>' +
      '<div class="lof__stock"><p><b>' + L.claimed + '%</b> claimed<span>Only a few left at this price</span></p><i style="--v:' + L.claimed / 100 + '"></i></div>' +
      '<div class="lof__sw" role="radiogroup" aria-label="Color"><p>Color: <b id="lofColor">' + sw(color).name + '</b></p><div>' +
        p.colors.map(function (k, i) {
          return '<button type="button" role="radio" aria-checked="' + !i + '" aria-label="' + sw(k).name + '" data-c="' + k + '" style="--c:' + sw(k).hex + '"></button>';
        }).join('') + '</div></div>' +
      '<div class="lof__cta"><button class="hbtn hbtn--line" type="button" data-act="add">Add to cart</button>' +
        '<button class="hbtn lof__buynow" type="button" data-act="buy">Buy now ' + svg('M5 12h14M13 6l6 6-6 6', 2) + '</button></div>' +
      '<p class="lof__note">' + L.offer.note + '</p>' +
    '</div>';

  $('lofPerks').innerHTML = d.perks.map(function (k) {
    return '<li>' + svg(k.icon, 1.6) + '<p><b>' + k.title + '</b><small>' + k.text + '</small></p></li>';
  }).join('');

  card.addEventListener('click', function (e) {
    var c = e.target.closest('[data-c]'), a = e.target.closest('[data-act]');
    if (c) {
      color = c.dataset.c;
      card.querySelectorAll('[data-c]').forEach(function (b) { b.setAttribute('aria-checked', String(b === c)); });
      $('lofColor').textContent = sw(color).name;
    }
    if (!a || !window.TeswayCart) return;
    window.TeswayCart.add(p.id, 1);
    if (a.dataset.act === 'buy') return window.TeswayCart.open();
    a.textContent = 'Added ✓';
    setTimeout(function () { a.textContent = 'Add to cart'; }, 1600);
  });

  /* countdown */
  var ends = new Date(L.ends).getTime();
  var two = function (v) { return (v < 10 ? '0' : '') + v; };
  function tick() {
    var t = Math.max(0, Math.floor((ends - Date.now()) / 1000));
    var v = { d: Math.floor(t / 86400), h: Math.floor(t / 3600) % 24, m: Math.floor(t / 60) % 60, s: t % 60 };
    document.querySelectorAll('[data-cd-part]').forEach(function (el) { el.textContent = two(v[el.dataset.cdPart]); });
    document.querySelectorAll('[data-cd="short"]').forEach(function (el) {
      el.textContent = v.d + 'd ' + two(v.h) + ':' + two(v.m) + ':' + two(v.s);
    });
  }
  tick();
  setInterval(tick, 1000);

  /* sticky deal bar: after the opening scene, hidden while the offer card is on screen */
  var bar = $('lbar'), hero = $('top'), offer = $('offer');
  bar.innerHTML = '<p class="lbar__txt"><b>' + money(p.price) + (p.was ? '<s>' + money(p.was) + '</s>' : '') + '</b>' +
    '<small><em>Launch deal</em> ends in <span data-cd="short"></span></small></p>' +
    '<a class="hbtn lbar__go" href="#offer">Claim deal</a>';
  tick();
  var queued = false;
  function sync() {
    queued = false;
    var h = hero.getBoundingClientRect(), o = offer.getBoundingClientRect();
    var on = h.bottom < innerHeight * 0.5 && (o.top > innerHeight * 0.85 || o.bottom < 0);
    bar.classList.toggle('is-on', on);
    bar.setAttribute('aria-hidden', String(!on));
    document.body.classList.toggle('has-lbar', on);
  }
  addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(sync); } }, { passive: true });
  sync();
})();
