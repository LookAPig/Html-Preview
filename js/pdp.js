/* ==== pdp-data.js ==== */
window.TESWAY_PDP_BUY = {
  points: function (p, x) {
    return [
      [x.motor, x.torque + ' N·m of torque for steep climbs and quick starts at every light.'],
      ['Up to ' + p.range + ' km range', x.battery + ' pack, removable and IPX6 sealed. Full charge in ' + x.charge + ' h.'],
      [x.tire, 'Grip and comfort on tarmac, gravel, sand and snow.'],
      [x.brake, 'Steady one-finger stopping power, even fully loaded and in the rain.'],
      [x.gears + ' · ' + x.sus, 'Smooth shifting and a planted, comfortable ride all day.'],
      ['3.5" color display + app', '5 assist levels, cruise control and ride stats on your phone.'],
      ['Ships 90% assembled', 'Ride in about 20 minutes. Bike weight ' + x.weight + ' kg, max load ' + x.load + ' kg.']
    ];
  },
  show: 5,
  deal: { name: 'Black Friday', sold: 33 },
  stock: { left: 7, of: 40 },
  bundle: ['battery', 'helmet', 'lock', 'bag'],
  bundleNote: { battery: 'Doubles your range', helmet: 'MIPS · M/L', lock: 'Sold Secure Gold', bag: '24 L · Waterproof' }
};

/* ==== pdp.js ==== */
(function () {
  var K = window.TeswayPDP;
  var N = window.TESWAY_PDP_BUY;
  var C = window.TESWAY_CART;
  var $ = function (id) { return document.getElementById(id); };
  var media = $('pnMedia'), buy = $('pnBuy');
  if (!K || !N || !C || !media || !buy) return;
  var d = K.d, D = K.D, p = K.p, x = K.x, money = K.money, svg = K.svg, stars = K.stars, sw = K.sw, shots = K.shots;
  var cat = {};
  C.products.forEach(function (c) { cat[c.id] = c; });
  var icon = function (body, cls) {
    return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  };
  var ico = {
    prev: svg('M15 6l-6 6 6 6'), next: svg('M9 6l6 6-6 6'),
    minus: svg('M6 12h12'), plus: svg('M12 6v12M6 12h12'), done: svg('M6 12.5l4 4 8-9'),
    check: svg('M6 12.5l4 4 8-9', 2.4), lock: icon('<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
    bolt: icon('<path d="M13 3 5.5 13.5H12L11 21l7.5-10.5H12z"/>'),
    tick: svg('M6 12.5l4 4 8-9', 2.2), down: svg('M6 9l6 6 6-6', 2)
  };
  var state = { color: p.colors[0], size: x.sizes[x.sizes.length > 2 ? 1 : 0], qty: 1, acc: {} };
  var hasSize = x.sizes[0] !== 'One';

  /* media */
  media.style.setProperty('--tone', sw(state.color).hex);
  media.innerHTML =
    '<div class="pm__rail" role="tablist" aria-label="Choose photo">' + shots.map(function (s, i) {
      return '<button class="pm__thumb' + (s.cut ? ' is-cut' : '') + (i ? '' : ' is-on') + '" type="button" role="tab" aria-selected="' + !i + '" data-i="' + i + '" style="--k:' + i + '" aria-label="Photo ' + (i + 1) + '">' +
        '<img src="' + s.src + '" alt="" loading="lazy" decoding="async"></button>';
    }).join('') + '</div>' +
    '<div class="pm__stage">' +
      '<ul class="pm__track">' + shots.map(function (s, i) {
        return '<li class="pm__slide' + (s.cut ? ' is-cut' : '') + (i ? '' : ' is-on') + '"><img src="' + s.src + '" alt="' + s.alt + '"' + (i ? ' loading="lazy"' : '') + ' decoding="async"></li>';
      }).join('') + '</ul>' +
      (p.tag ? '<i class="pm__tag">' + p.tag + '</i>' : '') +
      '<ul class="pm__chips">' + [[p.range, 'km range'], [x.torque, 'N·m'], [x.speed, 'km/h']].map(function (c, i) {
        return '<li style="--k:' + i + '"><b>' + c[0] + '</b>' + c[1] + '</li>';
      }).join('') + '</ul>' +
      '<p class="pm__count"><b>01</b> / 0' + shots.length + '</p>' +
      '<div class="pm__bars" aria-hidden="true">' + shots.map(function (s, i) { return '<i' + (i ? '' : ' class="is-on"') + '></i>'; }).join('') + '</div>' +
      '<button class="arw pm__arw" type="button" data-dir="-1" aria-label="Previous photo">' + ico.prev + '</button>' +
      '<button class="arw pm__arw" type="button" data-dir="1" aria-label="Next photo">' + ico.next + '</button>' +
    '</div>';

  var track = media.querySelector('.pm__track');
  var now = 0;
  function go(i) { track.scrollTo({ left: track.clientWidth * ((i + shots.length) % shots.length), behavior: 'smooth' }); }
  function mark(i) {
    now = i;
    media.querySelectorAll('.pm__thumb').forEach(function (t, k) { t.classList.toggle('is-on', k === i); t.setAttribute('aria-selected', String(k === i)); });
    media.querySelectorAll('.pm__slide').forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
    media.querySelectorAll('.pm__bars i').forEach(function (b, k) { b.classList.toggle('is-on', k === i); });
    media.querySelector('.pm__count b').textContent = '0' + (i + 1);
    media.classList.toggle('is-photo', !shots[i].cut);
  }
  track.addEventListener('scroll', function () {
    var i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== now) mark(i);
  }, { passive: true });
  media.addEventListener('click', function (e) {
    var b = e.target.closest('[data-i], [data-dir]');
    if (b) go(b.dataset.i ? +b.dataset.i : now + +b.dataset.dir);
  });

  /* buy column */
  var mods = [];
  function mod(cls, html) { mods.push('<div class="pb__mod ' + cls + '">' + html + '</div>'); }

  var pts = N.points(p, x).map(function (t, i) {
    return '<li style="--k:' + (i % N.show) + '">' + ico.tick + '<p><b>' + t[0] + '</b> ' + t[1] + '</p></li>';
  });
  var more = pts.length > N.show;

  mod('pb__head',
    '<p class="eyebrow eyebrow--dot">X1 Series · ' + (p.motor === 'dual' ? 'Dual motor' : 'Single motor') + '</p>' +
    '<div class="pb__top"><h1 class="pb__name"><span>' + p.name + '</span></h1>' +
      '<a class="pb__rate" href="#reviews" aria-label="Rated ' + p.rate + ' out of 5 from ' + p.reviews + ' reviews">' + stars(p.rate) +
        '<span><b>' + p.rate.toFixed(1) + '</b><small>' + p.reviews + ' reviews</small></span></a></div>' +
    '<p class="pb__sub">' + p.line + '</p>' +
    '<ul class="pb__pts">' + pts.slice(0, N.show).join('') + '</ul>' +
    (more ? '<div class="pb__more" id="pnMore"><ul class="pb__pts">' + pts.slice(N.show).join('') + '</ul></div>' +
      '<button class="pb__toggle" type="button" aria-expanded="false" aria-controls="pnMore"><span>Read more</span>' + ico.down + '</button>' : ''));
  mod('pb__price',
    '<div class="pb__row"><em data-from="' + (p.was || p.price) + '" data-to="' + p.price + '">' + money(p.price) + '</em>' +
      (p.was ? '<s>' + money(p.was) + '</s><i class="pb__save">Save ' + money(p.was - p.price) + '</i>' : '') + '</div>' +
    '<p class="pb__apr">or <b>' + money(Math.ceil(p.price / d.apr.months)) + '/mo</b> for ' + d.apr.months + ' months at 0% APR with ' +
      '<img src="' + d.apr.logo + '" alt="' + d.apr.by + '" width="420" height="167" decoding="async"></p>');
  mod('pb__cd',
    '<div class="pb__deal"><div class="pb__cd-copy"><p class="pb__cd-tag">' + ico.bolt + N.deal.name + ' deal</p>' +
      '<p class="pb__cd-title">' + (p.was ? 'Save ' + money(p.was - p.price) + ' ' : 'Deal price ') + '<em>ends in</em></p></div>' +
    '<div class="pb__flip" role="timer"></div>' +
    '<div class="pb__stock"><p><span>Only <b>' + N.stock.left + '</b> left at this price</span><small>' + N.deal.sold + ' sold in 24 h</small></p>' +
      '<i style="--w:' + (1 - N.stock.left / N.stock.of) + '"></i></div></div>');
  mod('pb__opts',
    '<div class="pb__opt"><p class="pb__label">Color <span id="pnColor">' + sw(state.color).name + '</span></p>' +
      '<div class="pb__sw" role="radiogroup" aria-label="Color">' + p.colors.map(function (k, i) {
        var on = k === state.color;
        return '<button class="pb__dot' + (on ? ' is-on' : '') + '" type="button" role="radio" aria-checked="' + on + '" data-c="' + k + '" aria-label="' + sw(k).name + '" title="' + sw(k).name + '" style="--c:' + sw(k).hex + ';--k:' + i + '"></button>';
      }).join('') + '</div></div>' +
    '<div class="pb__opt"><p class="pb__label">' + (hasSize ? 'Frame size <span>by rider height</span>' : 'Fits riders') + '</p>' +
      '<div class="pb__sizes" role="radiogroup" aria-label="Frame size">' + x.sizes.map(function (s, i) {
        var on = s === state.size;
        return '<button class="pb__size' + (on ? ' is-on' : '') + '" type="button" role="radio" aria-checked="' + on + '" data-s="' + s + '" style="--k:' + i + '">' +
          '<b>' + (s === 'One' ? 'One size' : s) + '</b><small>' + D.sizes[s] + '</small></button>';
      }).join('') + '</div></div>' +
    '<div class="pb__opt pb__bundle"><p class="pb__label">Add-ons <span id="pnBundle">Pick ride-ready extras</span></p>' +
      '<ul>' + N.bundle.map(function (id, i) {
        var a = cat[id];
        return '<li style="--k:' + i + '"><label class="pb__acc"><input type="checkbox" data-acc="' + id + '">' +
          '<span class="pb__acc-ico">' + icon(a.icon) + '</span>' +
          '<span class="pb__acc-txt"><b>' + a.name + '</b><small>' + N.bundleNote[id] + '</small></span>' +
          '<span class="pb__acc-price">+' + money(a.price) + '</span><span class="pi__box">' + ico.check + '</span></label></li>';
      }).join('') + '</ul></div>');
  mod('pb__cta',
    '<div class="pb__buy">' +
      '<div class="pi__qty" role="group" aria-label="Quantity"><button type="button" data-q="-1" aria-label="Decrease">' + ico.minus + '</button>' +
        '<output id="pnQty" aria-live="polite">1</output><button type="button" data-q="1" aria-label="Increase">' + ico.plus + '</button></div>' +
      '<button class="hbtn pi__add pb__add" type="button" data-buy>' + ico.plus + ico.done + '<span>Add to cart</span><b class="pi__sum" id="pnSum"></b></button>' +
      '<button class="hbtn pb__now" type="button" data-buy="now">Buy now</button></div>');
  mod('pb__pay',
    '<p class="pb__label">' + ico.lock + 'Guaranteed safe checkout</p>' +
    '<ul class="foot__pays" aria-label="Accepted payment methods">' + window.TESWAY_FOOT.pays.map(function (y, i) {
      return '<li title="' + y.name + '" style="--k:' + i + '">' + y.html + '</li>';
    }).join('') + '</ul>');
  mod('pb__svc',
    '<ul>' + d.perks.map(function (k, i) {
      var paths = k.icon.split(/(?=M)/).map(function (s) { return '<path d="' + s + '" pathLength="1"/>'; }).join('');
      return '<li style="--k:' + i + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + paths + '</svg><span><b>' + k.title + '</b><small>' + k.text + '</small></span></li>';
    }).join('') + '</ul>');
  buy.innerHTML = mods.join('');

  if (window.TeswayFlip && window.TESWAY_NOTICE) window.TeswayFlip.mount(buy.querySelector('.pb__flip'), window.TESWAY_NOTICE.deadline, ['Days', 'Hrs', 'Min', 'Sec']);

  /* state */
  var bar = $('pbar');
  bar.innerHTML = '<img class="pbar__pic" src="' + p.img + '.webp" alt="" decoding="async">' +
    '<p class="pbar__txt"><b>' + p.name + '</b><small id="pbarMeta"></small></p>' +
    '<button class="hbtn pi__add pbar__add" type="button" data-buy>' + ico.plus + ico.done + '<span>Add to cart</span></button>';

  function accs() { return N.bundle.filter(function (id) { return state.acc[id]; }); }
  function total() {
    return p.price * state.qty + accs().reduce(function (s, id) { return s + cat[id].price; }, 0);
  }
  function sync() {
    var a = accs();
    $('pnQty').textContent = state.qty;
    $('pnSum').textContent = money(total());
    $('pnBundle').textContent = a.length ? a.length + ' added · +' + money(total() - p.price * state.qty) : 'Pick ride-ready extras';
    $('pbarMeta').textContent = sw(state.color).name + (hasSize ? ' · Size ' + state.size : '') + ' · ' + money(total());
    var sum = $('pnSum');
    sum.classList.remove('is-tick');
    void sum.offsetWidth;
    sum.classList.add('is-tick');
  }
  function pick(sel, attr, val) {
    buy.querySelectorAll(sel).forEach(function (b) {
      var on = b.dataset[attr] === val;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', String(on));
    });
  }
  function add(btn, open) {
    var T = window.TeswayCart;
    if (!T) return;
    T.add(p.id, state.qty);
    accs().forEach(function (id) { T.add(id); });
    if (open) return T.open();
    btn.classList.add('is-done');
    btn.querySelector('span').textContent = 'Added';
    clearTimeout(btn._t);
    btn._t = setTimeout(function () {
      btn.classList.remove('is-done');
      btn.querySelector('span').textContent = 'Add to cart';
    }, 1600);
  }

  function toggleMore(btn) {
    var head = btn.closest('.pb__head');
    var open = head.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('span').textContent = open ? 'Read less' : 'Read more';
  }

  buy.addEventListener('click', function (e) {
    var tg = e.target.closest('.pb__toggle');
    if (tg) return toggleMore(tg);
    var b = e.target.closest('[data-c], [data-s], [data-q], [data-buy]');
    if (!b) return;
    if (b.dataset.c) {
      state.color = b.dataset.c;
      pick('.pb__dot', 'c', state.color);
      $('pnColor').textContent = sw(state.color).name;
      media.style.setProperty('--tone', sw(state.color).hex);
      media.classList.remove('is-swap');
      void media.offsetWidth;
      media.classList.add('is-swap');
      if (now) go(0);
    } else if (b.dataset.s) {
      state.size = b.dataset.s;
      pick('.pb__size', 's', state.size);
    } else if (b.dataset.q) {
      state.qty = Math.min(5, Math.max(1, state.qty + +b.dataset.q));
    } else return add(b, b.dataset.buy === 'now');
    sync();
  });
  buy.addEventListener('change', function (e) {
    var c = e.target.closest('[data-acc]');
    if (!c) return;
    state.acc[c.dataset.acc] = c.checked;
    sync();
  });
  bar.addEventListener('click', function (e) { var b = e.target.closest('[data-buy]'); if (b) add(b); });
  sync();

  var cta = buy.querySelector('.pb__buy');
  var foot = $('foot');
  function barCheck() {
    var on = cta.getBoundingClientRect().bottom < 0 && foot.getBoundingClientRect().top > innerHeight;
    if (on === bar.classList.contains('is-on')) return;
    bar.classList.toggle('is-on', on);
    bar.setAttribute('aria-hidden', String(!on));
    bar.inert = !on;
    document.body.classList.toggle('has-pbar', on);
  }
  addEventListener('scroll', barCheck, { passive: true });
  barCheck();

  /* module entrance */
  function roll(el) {
    var from = +el.dataset.from, to = +el.dataset.to, t0 = performance.now();
    if (from === to) return;
    (function tick(t) {
      var k = Math.min(1, (t - t0) / 1100);
      el.textContent = money(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
  function enter(els) {
    els.forEach(function (el, k) {
      el.style.setProperty('--d', (k * 0.07) + 's');
      el.classList.add('is-in');
      var em = el.querySelector('[data-from]');
      if (em) setTimeout(function () { roll(em); }, 250 + k * 70);
    });
  }
  var all = Array.prototype.slice.call(buy.querySelectorAll('.pb__mod'));
  if (!('IntersectionObserver' in window)) return enter(all);
  var io = new IntersectionObserver(function (es) {
    enter(es.filter(function (e) { return e.isIntersecting; }).map(function (e) { io.unobserve(e.target); return e.target; }));
  }, { threshold: 0.15, rootMargin: '0px 0px -4% 0px' });
  all.forEach(function (m) { io.observe(m); });
})();
