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
  chips: function (p, x) {
    return [
      [p.range, 'km', 'Range', '<circle cx="6" cy="17.5" r="2"/><circle cx="18" cy="6.5" r="2"/><path d="M8 17.5h7.5a3 3 0 0 0 0-6h-7a3 3 0 0 1 0-6H16"/>'],
      [x.torque, 'N·m', 'Torque', '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4v3.5H16"/><path d="m12 12 3-2.5"/>'],
      [x.speed, 'km/h', 'Top speed', '<path d="M4.5 16.5a7.5 7.5 0 1 1 15 0"/><path d="m12 16.5 3.5-4.5"/><path d="M7 16.5h.01M17 16.5h.01"/>'],
      [x.charge, 'h', 'Full charge', '<path d="M13 3 5.5 13.5H12L11 21l7.5-10.5H12z"/>']
    ];
  },
  ship: {
    arrive: [5, 8],
    truck: 'M3.5 7.5h10v8h-10zM13.5 10.5h4l3 3v2h-7zM7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
    zones: [
      ['Contiguous US', '3–7 business days', 'Free'],
      ['Alaska & Hawaii', '7–12 business days', '$199'],
      ['Canada', '7–10 business days', '$149'],
      ['Accessories only', '3–5 business days', 'Free over $2,000']
    ],
    info: [
      ['M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5V12l3 2', 'Order processing', 'Orders placed before 2 pm ET on business days ship within 48 hours. Weekend and holiday orders ship the next business day.'],
      ['M12 20.5s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0c0 4.9-6.5 10.5-6.5 10.5zM12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z', 'Tracking', 'A tracking link is sent by email and SMS as soon as your order leaves our warehouse.'],
      ['M4 8.5 12 4l8 4.5v7L12 20l-8-4.5zM4 8.5l8 4.5 8-4.5M12 13v7', 'Delivery & signature', 'Bikes ship in one box (about 38 kg) to your door. An adult signature may be required, so please inspect the box before signing.'],
      ['M12 4 3.5 19h17zM12 10v4M12 16.6v.1', 'Damaged in transit', 'Report any shipping damage within 48 hours with photos. We send replacement parts or a new bike at no cost.'],
      ['M4.5 19.5l1-4 10-10 3 3-10 10zM13.5 7.5l3 3', 'Address changes', 'Contact us before your order ships to update the address. We cannot deliver to PO boxes or freight forwarders.']
    ],
    note: 'Delivery times are estimates and may run longer during peak seasons or severe weather. Canadian orders include duties and taxes. For anything else, our riders\u2019 crew replies in minutes.'
  },
  svcFx: ['roll', 'tilt', 'pulse', 'hop'],
  model: '<div class="sketchfab-embed-wrapper"> <iframe title="Legend Monza 2016 eBike" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/f2f0db4692aa43cda2bcb6bf0fab3c10/embed"> </iframe> <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;"> <a href="https://sketchfab.com/3d-models/legend-monza-2016-ebike-f2f0db4692aa43cda2bcb6bf0fab3c10" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;"> Legend Monza 2016 eBike </a> by <a href="https://sketchfab.com/phixel" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;"> phixel </a> on <a href="https://sketchfab.com" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a></p></div>',
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
  var day = function (n) { return new Date(Date.now() + n * 864e5).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
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
      '<ul class="pm__chips">' + N.chips(p, x).map(function (c, i) {
        return '<li style="--k:' + i + '"><i>' + icon(c[3].replace(/<(path|circle)/g, '<$1 pathLength="1"')) + '</i>' +
          '<span><b data-to="' + c[0] + '">' + c[0] + '</b><small>' + c[1] + '</small><em>' + c[2] + '</em></span></li>';
      }).join('') + '</ul>' +
      '<p class="pm__count"><b>01</b> / 0' + shots.length + '</p>' +
      '<button class="arw pm__zoom" type="button" aria-haspopup="dialog" aria-label="Enlarge photo">' + icon('<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5M10.5 8v5M8 10.5h5"/>') + '</button>' +
      '<div class="pm__bars" aria-hidden="true">' + shots.map(function (s, i) { return '<i' + (i ? '' : ' class="is-on"') + '></i>'; }).join('') + '</div>' +
      '<button class="arw pm__arw" type="button" data-dir="-1" aria-label="Previous photo">' + ico.prev + '</button>' +
      '<button class="arw pm__arw" type="button" data-dir="1" aria-label="Next photo">' + ico.next + '</button>' +
      '<div class="pm__3d" aria-hidden="true" inert><p class="pm__load"><i></i>Loading 3D model</p></div>' +
    '</div>' +
    '<div class="pm__mode" role="group" aria-label="View mode"><i class="pm__pill" aria-hidden="true"></i>' +
      '<button type="button" data-mode="photo" aria-pressed="true">' + icon('<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="m3.5 16 5-5 4 4 2.5-2.5 5 5"/><circle cx="15.5" cy="9.5" r="1.5"/>') + 'Photos</button>' +
      '<button type="button" data-mode="3d" aria-pressed="false">' + icon('<path d="M12 3.5 4.5 7.75v8.5L12 20.5l7.5-4.25v-8.5z"/><path d="m4.5 7.75 7.5 4.25 7.5-4.25M12 12v8.5"/>') + '3D view</button>' +
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
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    media.querySelectorAll('.pm__chips b').forEach(function (b, i) {
      var to = +b.dataset.to, dp = to % 1 ? 1 : 0, t0 = performance.now() + 900 + i * 120;
      b.textContent = (0).toFixed(dp);
      (function tick(t) {
        var k = Math.min(Math.max((t - t0) / 1100, 0), 1);
        b.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dp);
        if (k < 1) requestAnimationFrame(tick);
      })(performance.now());
    });
  }

  var box3d = media.querySelector('.pm__3d');
  function view(m) {
    var on = m === '3d';
    if (on === media.classList.contains('is-3d')) return;
    if (on && !box3d.querySelector('iframe')) {
      box3d.insertAdjacentHTML('beforeend', N.model);
      box3d.querySelector('iframe').addEventListener('load', function () { box3d.classList.add('is-ready'); });
    }
    media.classList.toggle('is-3d', on);
    box3d.inert = !on;
    box3d.setAttribute('aria-hidden', String(!on));
    track.inert = on;
    media.querySelectorAll('.pm__arw, .pm__zoom').forEach(function (a) { a.inert = on; });
    media.querySelectorAll('[data-mode]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === m)); });
  }
  /* photo lightbox */
  var lb = null, lbI = 0, lbBack = null, lbX = 0, lbMoved = false;
  function lbBuild() {
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Photo viewer');
    lb.setAttribute('aria-hidden', 'true');
    lb.inert = true;
    lb.innerHTML = '<div class="lb__scrim" data-lb-close></div>' +
      '<div class="lb__top"><p class="lb__count"><b>01</b> / 0' + shots.length + '</p>' +
        '<button class="arw lb__x" type="button" data-lb-close aria-label="Close photo viewer">' + svg('M7 7l10 10M17 7 7 17') + '</button></div>' +
      '<div class="lb__stage"><figure class="lb__fig"><img class="lb__img" alt="" decoding="async" draggable="false"></figure></div>' +
      '<button class="arw lb__arw" type="button" data-lb-dir="-1" aria-label="Previous photo">' + ico.prev + '</button>' +
      '<button class="arw lb__arw" type="button" data-lb-dir="1" aria-label="Next photo">' + ico.next + '</button>' +
      '<div class="lb__thumbs">' + shots.map(function (s, i) {
        return '<button class="lb__thumb' + (s.cut ? ' is-cut' : '') + '" type="button" data-lb-i="' + i + '" aria-label="Show photo ' + (i + 1) + '"><img src="' + s.src + '" alt="" decoding="async"></button>';
      }).join('') + '</div>' +
      '<p class="lb__hint">Click image to zoom</p>';
    document.body.appendChild(lb);
    var fig = lb.querySelector('.lb__fig');
    function origin(e) {
      var r = fig.getBoundingClientRect();
      fig.style.setProperty('--ox', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      fig.style.setProperty('--oy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    }
    fig.addEventListener('pointerdown', function (e) { lbX = e.clientX; lbMoved = false; });
    fig.addEventListener('pointermove', function (e) {
      if (Math.abs(e.clientX - lbX) > 8 && e.buttons) lbMoved = true;
      if (fig.classList.contains('is-zoom')) origin(e);
    });
    fig.addEventListener('pointerup', function (e) {
      var dx = e.clientX - lbX;
      if (!fig.classList.contains('is-zoom') && Math.abs(dx) > 60) lbShow(lbI + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    fig.addEventListener('click', function (e) {
      if (lbMoved) return;
      origin(e);
      var z = fig.classList.toggle('is-zoom');
      lb.querySelector('.lb__hint').textContent = z ? 'Move to pan · click to zoom out' : 'Click image to zoom';
    });
    lb.addEventListener('click', function (e) {
      if (e.target.closest('[data-lb-close]')) return lbOpen(false);
      var d = e.target.closest('[data-lb-dir]'), t = e.target.closest('[data-lb-i]');
      if (d) lbShow(lbI + +d.dataset.lbDir, +d.dataset.lbDir);
      else if (t) lbShow(+t.dataset.lbI, +t.dataset.lbI > lbI ? 1 : -1);
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-on')) return;
      if (e.key === 'Escape') return lbOpen(false);
      if (e.key === 'ArrowLeft') return lbShow(lbI - 1, -1);
      if (e.key === 'ArrowRight') return lbShow(lbI + 1, 1);
      if (e.key !== 'Tab') return;
      var f = lb.querySelectorAll('button');
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }
  function lbShow(i, dir) {
    lbI = (i + shots.length) % shots.length;
    var s = shots[lbI], fig = lb.querySelector('.lb__fig'), img = lb.querySelector('.lb__img');
    fig.classList.remove('is-zoom', 'is-swap');
    fig.classList.toggle('is-cut', !!s.cut);
    fig.style.setProperty('--dx', dir || 0);
    img.src = s.src;
    img.alt = s.alt;
    void fig.offsetWidth;
    fig.classList.add('is-swap');
    lb.querySelector('.lb__count b').textContent = '0' + (lbI + 1);
    lb.querySelector('.lb__hint').textContent = 'Click image to zoom';
    lb.querySelectorAll('.lb__thumb').forEach(function (t, k) { t.classList.toggle('is-on', k === lbI); t.setAttribute('aria-current', String(k === lbI)); });
  }
  function lbOpen(on, i) {
    if (!lb) { if (!on) return; lbBuild(); }
    if (on === lb.classList.contains('is-on')) return;
    if (on) { lbBack = document.activeElement; lbShow(i, 0); }
    lb.classList.toggle('is-on', on);
    lb.setAttribute('aria-hidden', String(!on));
    lb.inert = !on;
    document.body.style.overflow = on ? 'hidden' : '';
    if (on) setTimeout(function () { lb.querySelector('.lb__x').focus({ preventScroll: true }); }, 60);
    else {
      track.scrollTo({ left: track.clientWidth * lbI, behavior: 'instant' });
      if (lbBack) lbBack.focus({ preventScroll: true });
    }
  }

  media.addEventListener('click', function (e) {
    if (e.target.closest('.pm__zoom, .pm__slide')) return lbOpen(true, now);
    var v = e.target.closest('[data-mode]');
    if (v) return view(v.dataset.mode);
    var b = e.target.closest('[data-i], [data-dir]');
    if (!b) return;
    if (b.dataset.i) view('photo');
    go(b.dataset.i ? +b.dataset.i : now + +b.dataset.dir);
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
      '<button class="hbtn pb__now" type="button" data-buy="now">Buy now</button></div>' +
    '<p class="pb__ship">' + svg(N.ship.truck, 1.6) + '<span>Free delivery <b>' + day(N.ship.arrive[0]) + ' – ' + day(N.ship.arrive[1]) + '</b> · ships within 48 h</span>' +
      '<button class="pb__info" type="button" data-ship aria-haspopup="dialog" aria-controls="ship" aria-label="Shipping policy">' +
        icon('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><path d="M12 7.6v.1"/>') + '</button></p>');
  mod('pb__pay',
    '<p class="pb__label">' + ico.lock + 'Guaranteed safe checkout</p>' +
    '<ul class="foot__pays" aria-label="Accepted payment methods">' + window.TESWAY_FOOT.pays.map(function (y, i) {
      return '<li title="' + y.name + '" style="--k:' + i + '">' + y.html + '</li>';
    }).join('') + '</ul>');
  mod('pb__svc',
    '<p class="pb__label">The TESWAY promise<span>Included with every bike</span></p>' +
    '<ul>' + d.perks.map(function (k, i) {
      var paths = k.icon.split(/(?=M)/).map(function (s) { return '<path d="' + s + '" pathLength="1"/>'; }).join('');
      return '<li style="--k:' + i + '"><i class="pb__svc-ico pb__svc-ico--' + N.svcFx[i % N.svcFx.length] + '"><svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<g class="ico-base">' + paths + '</g><g class="ico-draw">' + paths + '</g></svg></i><span><b>' + k.title + '</b><small>' + k.text + '</small></span></li>';
    }).join('') + '</ul>');
  buy.innerHTML = mods.join('');

  /* delivery dialog */
  var S = N.ship;
  var ship = document.createElement('div');
  ship.className = 'ship';
  ship.id = 'ship';
  ship.setAttribute('role', 'dialog');
  ship.setAttribute('aria-modal', 'true');
  ship.setAttribute('aria-labelledby', 'shipTitle');
  ship.setAttribute('aria-hidden', 'true');
  ship.inert = true;
  ship.innerHTML = '<div class="ship__scrim" data-close></div>' +
    '<div class="ship__panel">' +
      '<header class="ship__head"><div><p class="eyebrow eyebrow--dot">Shipping policy</p><h2 id="shipTitle">Shipping <em>&amp; delivery</em></h2></div>' +
        '<button class="ship__x" type="button" data-close aria-label="Close shipping policy">' + svg('M7 7l10 10M17 7 7 17') + '</button></header>' +
      '<p class="ship__eta">' + svg(S.truck, 1.6) + '<span>Order today, get it <b>' + day(S.arrive[0]) + ' – ' + day(S.arrive[1]) + '</b></span></p>' +
      '<table class="ship__zones"><thead><tr><th scope="col">Destination</th><th scope="col">Delivery</th><th scope="col">Cost</th></tr></thead><tbody>' +
        S.zones.map(function (z, i) {
          return '<tr style="--k:' + i + '"><th scope="row">' + z[0] + '</th><td>' + z[1] + '</td><td' + (z[2].indexOf('Free') === 0 ? ' class="is-free"' : '') + '>' + z[2] + '</td></tr>';
        }).join('') + '</tbody></table>' +
      '<ul class="ship__info">' + S.info.map(function (r, i) {
        return '<li style="--k:' + i + '">' + svg(r[0], 1.6) + '<span><b>' + r[1] + '</b><small>' + r[2] + '</small></span></li>';
      }).join('') + '</ul>' +
      '<p class="ship__note">' + S.note + '</p>' +
      '<button class="hbtn ship__ok" type="button" data-close>Got it</button>' +
    '</div>';
  document.body.appendChild(ship);
  var shipBack = null;
  function shipOpen(on) {
    if (on === ship.classList.contains('is-on')) return;
    if (on) shipBack = document.activeElement;
    ship.classList.toggle('is-on', on);
    ship.setAttribute('aria-hidden', String(!on));
    ship.inert = !on;
    document.body.style.overflow = on ? 'hidden' : '';
    if (on) setTimeout(function () { ship.querySelector('.ship__x').focus({ preventScroll: true }); }, 60);
    else if (shipBack) shipBack.focus({ preventScroll: true });
  }
  ship.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) shipOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (!ship.classList.contains('is-on')) return;
    if (e.key === 'Escape') return shipOpen(false);
    if (e.key !== 'Tab') return;
    var f = ship.querySelectorAll('.ship__panel button');
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

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
    if (e.target.closest('[data-ship]')) return shipOpen(true);
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

/* sub-nav: stuck state, scroll-spy, sliding ink */
(function () {
  var bar = document.getElementById('psub'), list = document.getElementById('psubList');
  if (!bar || !list) return;
  var K = window.TeswayPDP, nav = document.getElementById('nav');
  var name = document.getElementById('psubName');
  if (K && K.p) name.textContent = K.p.name;
  var links = Array.prototype.slice.call(list.querySelectorAll('a'));
  links.forEach(function (a, k) { a.parentNode.style.setProperty('--k', k); });
  var secs = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var on = -1, queued = false;
  function ink(a) {
    var ox = a.parentNode.offsetLeft;
    list.style.setProperty('--x', ox + 'px');
    list.style.setProperty('--w', a.offsetWidth + 'px');
    list.classList.add('has-on');
    var l = ox - (list.clientWidth - a.offsetWidth) / 2;
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: l, behavior: 'smooth' });
  }
  function pick(i) {
    if (i === on) return;
    on = i;
    links.forEach(function (a, k) {
      a.classList.toggle('is-on', k === i);
      if (k === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    if (i < 0) list.classList.remove('has-on'); else ink(links[i]);
  }
  function tick() {
    queued = false;
    var navB = nav ? nav.getBoundingClientRect().bottom : 0;
    var r = bar.getBoundingClientRect();
    bar.classList.toggle('is-stuck', r.top <= navB + 0.5);
    var cur = -1;
    secs.forEach(function (s, k) {
      if (!s) return;
      var secY = parseFloat(getComputedStyle(s).paddingTop) || 0;
      if (s.getBoundingClientRect().top <= r.bottom - secY / 2 + 8) cur = k;
    });
    pick(cur);
  }
  function ask() { if (!queued) { queued = true; requestAnimationFrame(tick); } }
  list.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null, s = a && secs[links.indexOf(a)];
    if (!s) return;
    e.preventDefault();
    var secY = parseFloat(getComputedStyle(s).paddingTop) || 0;
    var y = s.getBoundingClientRect().top + window.pageYOffset - (nav.offsetHeight + bar.offsetHeight - secY / 2);
    if (window.TeswayScrollTo) window.TeswayScrollTo(y, true); else window.scrollTo({ top: y, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#' + s.id);
  });
  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', function () { var c = on; on = -2; pick(c); ask(); });
  tick();
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { bar.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(bar);
  } else bar.classList.add('is-in');
})();

/* video section: load on demand, click to play */
(function () {
  var box = document.getElementById('pvidFrame'), v = document.getElementById('pvidV'), btn = document.getElementById('pvidPlay');
  if (!box || !v || !btn) return;
  if (window.matchMedia('(max-aspect-ratio: 999/1000)').matches) v.setAttribute('poster', 'Images/hero-mobile.jpg');
  btn.addEventListener('click', function () {
    if (!v.getAttribute('src')) v.src = v.getAttribute('data-src');
    v.controls = true;
    box.classList.add('is-play');
    var pr = v.play();
    if (pr && pr.catch) pr.catch(function () { box.classList.remove('is-play'); v.controls = false; });
  });
  v.addEventListener('pause', function () { if (v.ended || v.currentTime === 0) { box.classList.remove('is-play'); v.controls = false; } });
})();
