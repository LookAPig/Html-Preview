/* ==== product-data.js ==== */
window.TESWAY_PDP = {
  bikes: {
    dual: { motor: 'Dual 750 W hubs', torque: 120, speed: 45, battery: '48V 25Ah · 1200 Wh', charge: 6, weight: 34, load: 150,
      tire: '20 × 4.0" fat tires', brake: 'Hydraulic disc · 180 mm', gears: 'Shimano 7-speed', sus: 'Front fork · 80 mm',
      sizes: ['M', 'L'], scene: 'bike-dual', story: 'story-camp', feats: ['dual', 'battery', 'brake'] },
    trail: { motor: 'Dual 750 W hubs', torque: 110, speed: 45, battery: '48V 21.7Ah · 1040 Wh', charge: 5.5, weight: 32, load: 140,
      tire: '26 × 4.0" fat tires', brake: 'Hydraulic disc · 203 mm', gears: 'Shimano 8-speed', sus: 'Full · 120 mm travel',
      sizes: ['M', 'L'], scene: 'bike-trail', story: 'scenes/scene-hunting', feats: ['sus', 'dual', 'brake'] },
    city: { motor: 'Rear 500 W hub', torque: 65, speed: 32, battery: '48V 15Ah · 720 Wh', charge: 4.5, weight: 22, load: 120,
      tire: '27.5 × 2.0" city tires', brake: 'Hydraulic disc · 160 mm', gears: 'Gates belt · single speed', sus: 'Rigid fork',
      sizes: ['S', 'M', 'L'], scene: 'bike-city', story: 'hero-desktop', feats: ['light', 'belt', 'battery'] },
    family: { motor: 'Rear 750 W hub', torque: 85, speed: 32, battery: '48V 20Ah · 960 Wh', charge: 5, weight: 36, load: 150,
      tire: '20 × 3.0" balloon tires', brake: 'Hydraulic disc · 180 mm', gears: 'Shimano 7-speed', sus: 'Front fork · 60 mm',
      sizes: ['One'], scene: 'bike-family', story: 'story-family', feats: ['seat', 'step', 'brake'] },
    citystep: { motor: 'Rear 500 W hub', torque: 65, speed: 32, battery: '48V 14Ah · 672 Wh', charge: 4.5, weight: 23, load: 120,
      tire: '26 × 2.2" city tires', brake: 'Hydraulic disc · 160 mm', gears: 'Shimano 7-speed', sus: 'Front fork · 50 mm',
      sizes: ['S', 'M', 'L'], scene: 'bike-city', story: 'hero-family', feats: ['step', 'light', 'battery'] },
    cargo: { motor: 'Dual 750 W hubs', torque: 120, speed: 40, battery: 'Dual 48V 20Ah · 1920 Wh', charge: 7, weight: 42, load: 200,
      tire: '20 × 4.0" fat tires', brake: 'Hydraulic disc · 203 mm', gears: 'Shimano 8-speed', sus: 'Front fork · 80 mm',
      sizes: ['One'], scene: 'bike-cargo', story: 'story-delivery', feats: ['rack', 'battery', 'dual'] }
  },
  sizes: { S: '150 – 170 cm', M: '165 – 185 cm', L: '180 – 200 cm', One: '155 – 195 cm' },
  feats: {
    dual: ['Two motors, one ride', 'Front and rear hubs share the load, so you climb 30° grades and push through sand, snow and gravel without breaking a sweat.'],
    battery: ['Range that keeps going', 'Samsung cells sealed to IPX6. The pack locks in place and slides out in seconds to charge indoors.'],
    brake: ['Stops on a dime', 'Hydraulic discs give steady one-finger braking: fully loaded, downhill, in the rain.'],
    sus: ['Soaks up the trail', 'Full suspension keeps both tires planted, so roots and rocks feel like smooth tarmac.'],
    light: ['Light on its feet', 'An alloy frame you can lift up the stairs, with power that feels like a tailwind every block.'],
    belt: ['Clean, quiet belt', 'A carbon belt drive that never needs oil and runs silent for 30,000 km.'],
    seat: ['Room for the little one', 'A rated child seat mount and a low center of gravity keep the school run calm and steady.'],
    step: ['Easy on, easy off', 'A low step-through frame fits riders of every height and every outfit.'],
    rack: ['Built to haul', 'A 50 kg rear rack and front basket mount turn one bike into your delivery van.']
  },
  dist: [82, 12, 4, 1, 1],
  reviews: [
    { n: 'Jake M.', c: 'Denver, CO', r: 5, t: 'Hills? What hills.', x: 'My commute has a 9% climb I used to dread. Now I pass road bikes on it with a grin. Assembly took 30 minutes.', d: 'Nov 12, 2026', use: 'Daily commute' },
    { n: 'Sofia R.', c: 'Austin, TX', r: 5, t: 'Range is the real deal', x: 'Did 128 km on one charge on mixed terrain with pedal assist 2. Battery still showed a bar left.', d: 'Oct 30, 2026', use: 'Weekend rides' },
    { n: 'Liam K.', c: 'Portland, OR', r: 4, t: 'Solid build, heavy bike', x: 'Feels built like a tank and rides beautifully in the rain. Just know it is not light if you have stairs.', d: 'Oct 18, 2026', use: 'All weather' },
    { n: 'Priya S.', c: 'San Diego, CA', r: 5, t: 'Support was amazing', x: 'Had a question about the display settings and the crew replied in four minutes. Bike is a joy.', d: 'Sep 27, 2026', use: 'Leisure' }
  ]
};

/* ==== product-kit.js ==== */
window.TeswayPDP = (function () {
  var d = window.TESWAY_COLL;
  var D = window.TESWAY_PDP;
  if (!d || !D) return null;
  var q = new URLSearchParams(location.search).get('id');
  var p = d.items.filter(function (x) { return x.id === q; })[0] || d.items[0];
  var x = D.bikes[p.id];
  return {
    d: d, D: D, p: p, x: x,
    money: function (n) { return '$' + n.toLocaleString('en-US'); },
    svg: function (path, w) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"/></svg>';
    },
    stars: function (r) { return '<span class="stars" style="--r:' + (r / 5 * 100) + '%" aria-hidden="true"></span>'; },
    sw: function (k) { return d.swatches[k]; },
    shots: [
      { src: p.img + '.webp', alt: p.name + ', side view', cut: 1 },
      { src: 'Images/' + x.scene + '.jpg', alt: p.name + ' on the road' },
      { src: 'Images/' + x.story + '.jpg', alt: 'Out riding the ' + p.name },
      { src: 'Images/brand-beyond.jpg', alt: 'TESWAY riders at sunrise' }
    ]
  };
})();

/* ==== product.js ==== */
(function () {
  var K = window.TeswayPDP;
  var $ = function (id) { return document.getElementById(id); };
  var info = $('pdpInfo');
  if (!K || !info) return;
  var d = K.d, D = K.D, p = K.p, x = K.x, money = K.money, svg = K.svg, stars = K.stars, sw = K.sw, shots = K.shots;
  var BATTERY = 349;
  var ico = {
    prev: svg('M15 6l-6 6 6 6'), next: svg('M9 6l6 6-6 6'),
    minus: svg('M6 12h12'), plus: svg('M12 6v12M6 12h12'), done: svg('M6 12.5l4 4 8-9'),
    truck: svg(d.perks[0].icon, 1.6), check: svg('M6 12.5l4 4 8-9', 2.4)
  };
  var state = { color: p.colors[0], size: x.sizes[x.sizes.length > 2 ? 1 : 0], qty: 1, extra: false };

  /* gallery */
  var gal = $('pdpGallery');
  gal.style.setProperty('--tone', sw(state.color).hex);
  gal.innerHTML = '<div class="pg__stage">' + (p.tag ? '<i class="pg__tag">' + p.tag + '</i>' : '') +
    '<ul class="pg__track">' + shots.map(function (s, i) {
      return '<li class="pg__slide' + (s.cut ? ' is-cut' : '') + '" aria-label="' + (i + 1) + ' of ' + shots.length + '">' +
        '<img src="' + s.src + '" alt="' + s.alt + '"' + (i ? ' loading="lazy"' : '') + ' decoding="async"></li>';
    }).join('') + '</ul>' +
    '<p class="pg__count"><b>01</b> / 0' + shots.length + '</p>' +
    '<button class="arw pg__arw" type="button" data-dir="-1" aria-label="Previous photo">' + ico.prev + '</button>' +
    '<button class="arw pg__arw" type="button" data-dir="1" aria-label="Next photo">' + ico.next + '</button></div>' +
    '<div class="pg__thumbs">' + shots.map(function (s, i) {
      return '<button class="pg__thumb' + (s.cut ? ' is-cut' : '') + (i ? '' : ' is-on') + '" type="button" data-i="' + i + '" aria-label="Show photo ' + (i + 1) + '">' +
        '<img src="' + s.src + '" alt="" loading="lazy" decoding="async"></button>';
    }).join('') + '</div>';

  var track = gal.querySelector('.pg__track');
  var thumbs = gal.querySelectorAll('.pg__thumb');
  var now = 0;
  function go(i) { track.scrollTo({ left: track.clientWidth * ((i + shots.length) % shots.length), behavior: 'smooth' }); }
  track.addEventListener('scroll', function () {
    var i = Math.round(track.scrollLeft / track.clientWidth);
    if (i === now) return;
    now = i;
    thumbs.forEach(function (t, k) { t.classList.toggle('is-on', k === i); });
    gal.querySelector('.pg__count b').textContent = '0' + (i + 1);
  }, { passive: true });
  gal.addEventListener('click', function (e) {
    var b = e.target.closest('[data-i], [data-dir]');
    if (b) go(b.dataset.i ? +b.dataset.i : now + +b.dataset.dir);
  });

  /* buy box */
  var hasSize = x.sizes[0] !== 'One';
  info.innerHTML =
    '<p class="eyebrow eyebrow--dot">X1 Series · ' + (p.motor === 'dual' ? 'Dual motor' : 'Single motor') + '</p>' +
    '<h1 class="pi__name">' + p.name + '</h1>' +
    '<a class="pi__rate" href="#reviews">' + stars(p.rate) + '<b>' + p.rate.toFixed(1) + '</b><span>' + p.reviews + ' reviews</span></a>' +
    '<p class="pi__line">' + p.line + '</p>' +
    '<div class="pi__price"><em>' + money(p.price) + '</em>' + (p.was ? '<s>' + money(p.was) + '</s><i>Save ' + money(p.was - p.price) + '</i>' : '') + '</div>' +
    '<p class="pi__apr">or <b>' + money(Math.ceil(p.price / d.apr.months)) + '/mo</b> for ' + d.apr.months + ' months · 0% APR with ' +
      '<img src="' + d.apr.logo + '" alt="' + d.apr.by + '" width="420" height="167" decoding="async"></p>' +
    '<ul class="pi__specs">' +
      '<li><b>' + p.range + '</b><small>km range</small></li>' +
      '<li><b>' + x.torque + '</b><small>N·m torque</small></li>' +
      '<li><b>' + x.speed + '</b><small>km/h top</small></li></ul>' +
    '<div class="pi__opt"><p class="pi__label">Color <span id="piColor">' + sw(state.color).name + '</span></p>' +
      '<div class="pi__sw" role="radiogroup" aria-label="Color">' + p.colors.map(function (k) {
        var on = k === state.color;
        return '<button class="pi__dot' + (on ? ' is-on' : '') + '" type="button" role="radio" aria-checked="' + on + '" data-c="' + k + '" aria-label="' + sw(k).name + '" title="' + sw(k).name + '" style="--c:' + sw(k).hex + '"></button>';
      }).join('') + '</div></div>' +
    '<div class="pi__opt"><p class="pi__label">' + (hasSize ? 'Frame size' : 'Fits riders') + ' <span id="piSize">' + D.sizes[state.size] + '</span></p>' +
      '<div class="pi__sizes" role="radiogroup" aria-label="Frame size">' + x.sizes.map(function (s) {
        var on = s === state.size;
        return '<button class="pi__size' + (on ? ' is-on' : '') + '" type="button" role="radio" aria-checked="' + on + '" data-s="' + s + '">' +
          (s === 'One' ? 'One size' : s) + '</button>';
      }).join('') + '</div></div>' +
    '<label class="pi__extra"><input type="checkbox" id="piExtra"><span class="pi__box">' + ico.check + '</span>' +
      '<span class="pi__extra-txt"><b>Add a spare battery</b><small>Double your range · +' + money(BATTERY) + '</small></span></label>' +
    '<div class="pi__buy">' +
      '<div class="pi__qty" role="group" aria-label="Quantity"><button type="button" data-q="-1" aria-label="Decrease">' + ico.minus + '</button>' +
        '<output id="piQty" aria-live="polite">1</output><button type="button" data-q="1" aria-label="Increase">' + ico.plus + '</button></div>' +
      '<button class="hbtn pi__add" type="button" data-buy>' + ico.plus + ico.done + '<span>Add to cart</span><b class="pi__sum"></b></button></div>' +
    '<button class="hbtn hbtn--line pi__now" type="button" data-buy="now">Buy it now</button>' +
    '<p class="pi__ship">' + ico.truck + '<span>Order today, delivered <b>' + eta(5) + ' – ' + eta(8) + '</b>. Free shipping.</span></p>' +
    '<ul class="pi__perks">' + d.perks.slice(1).map(function (k) {
      return '<li>' + svg(k.icon, 1.6) + '<span><b>' + k.title + '</b><small>' + k.text + '</small></span></li>';
    }).join('') + '</ul>';

  function eta(n) {
    var t = new Date(Date.now() + n * 864e5);
    return t.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  var bar = $('pbar');
  bar.innerHTML = '<img class="pbar__pic" src="' + p.img + '.webp" alt="" decoding="async">' +
    '<p class="pbar__txt"><b>' + p.name + '</b><small id="pbarMeta"></small></p>' +
    '<button class="hbtn pi__add pbar__add" type="button" data-buy>' + ico.plus + ico.done + '<span>Add to cart</span></button>';

  function total() { return (p.price + (state.extra ? BATTERY : 0)) * state.qty; }
  function sync() {
    $('piQty').textContent = state.qty;
    info.querySelector('.pi__sum').textContent = money(total());
    $('pbarMeta').textContent = sw(state.color).name + (hasSize ? ' · Size ' + state.size : '') + ' · ' + money(total());
  }

  function pick(group, attr, val) {
    info.querySelectorAll(group).forEach(function (b) {
      var on = b.dataset[attr] === val;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', String(on));
    });
  }

  function buy(btn, now) {
    var C = window.TeswayCart;
    if (!C) return;
    C.add(p.id, state.qty);
    if (state.extra) C.add('battery', state.qty);
    if (now) return C.open();
    btn.classList.add('is-done');
    btn.querySelector('span').textContent = 'Added';
    clearTimeout(btn._t);
    btn._t = setTimeout(function () {
      btn.classList.remove('is-done');
      btn.querySelector('span').textContent = 'Add to cart';
    }, 1600);
  }

  info.addEventListener('click', function (e) {
    var b = e.target.closest('[data-c], [data-s], [data-q], [data-buy]');
    if (!b) return;
    if (b.dataset.c) {
      state.color = b.dataset.c;
      pick('.pi__dot', 'c', state.color);
      $('piColor').textContent = sw(state.color).name;
      gal.style.setProperty('--tone', sw(state.color).hex);
      gal.classList.remove('is-swap');
      void gal.offsetWidth;
      gal.classList.add('is-swap');
      if (now) go(0);
    } else if (b.dataset.s) {
      state.size = b.dataset.s;
      pick('.pi__size', 's', state.size);
      $('piSize').textContent = D.sizes[state.size];
    } else if (b.dataset.q) {
      state.qty = Math.min(5, Math.max(1, state.qty + +b.dataset.q));
    } else return buy(b, b.dataset.buy === 'now');
    sync();
  });
  $('piExtra').addEventListener('change', function (e) { state.extra = e.target.checked; sync(); });
  bar.addEventListener('click', function (e) { var b = e.target.closest('[data-buy]'); if (b) buy(b); });
  sync();

  var buyRow = info.querySelector('.pi__buy');
  var foot = $('foot');
  function barCheck() {
    var on = buyRow.getBoundingClientRect().bottom < 0 && foot.getBoundingClientRect().top > innerHeight;
    if (on === bar.classList.contains('is-on')) return;
    bar.classList.toggle('is-on', on);
    bar.setAttribute('aria-hidden', String(!on));
    bar.inert = !on;
    document.body.classList.toggle('has-pbar', on);
  }
  addEventListener('scroll', barCheck, { passive: true });
  barCheck();
})();

/* ==== product-sections.js ==== */
(function () {
  var K = window.TeswayPDP;
  var $ = function (id) { return document.getElementById(id); };
  if (!K || !$('phiStats')) return;
  var d = K.d, D = K.D, p = K.p, x = K.x, money = K.money, svg = K.svg, stars = K.stars, sw = K.sw;
  var ico = { plus: svg('M12 6v12M6 12h12'), done: svg('M6 12.5l4 4 8-9') };

  document.title = p.name + ' | TESWAY · Go Far Away';
  $('pdpCrumb').innerHTML = '<a href="index.html">Home</a><span aria-hidden="true">/</span><a href="collection.html">Bikes</a>' +
    '<span aria-hidden="true">/</span><b aria-current="page">' + p.name + '</b>';

  /* highlights */
  $('phiEyebrow').textContent = 'Why the ' + p.name;
  $('phiSub').textContent = p.line;
  var stats = [[p.range, 'km', 'Max range'], [x.torque, 'N·m', 'Peak torque'], [x.speed, 'km/h', 'Top speed'], [x.charge, 'h', 'Full charge']];
  $('phiStats').innerHTML = stats.map(function (s) {
    return '<li><p><b data-to="' + s[0] + '">0</b><small>' + s[1] + '</small></p><span>' + s[2] + '</span></li>';
  }).join('');
  var pics = [x.scene, x.story, 'brand-beyond'];
  $('phiFeats').innerHTML = x.feats.map(function (k, i) {
    var f = D.feats[k];
    return '<article class="pf reveal"><figure class="pf__pic"><img src="Images/' + pics[i] + '.jpg" alt="" loading="lazy" decoding="async"></figure>' +
      '<div class="pf__txt"><i class="pf__no">0' + (i + 1) + '</i><h3>' + f[0] + '</h3><p>' + f[1] + '</p></div></article>';
  }).join('');

  function count(el) {
    var to = +el.dataset.to, dec = to % 1 ? 1 : 0, t0 = performance.now();
    (function tick(t) {
      var k = Math.min(1, (t - t0) / 1400);
      el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec);
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var nums = document.querySelectorAll('[data-to]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { count(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  } else nums.forEach(function (n) { n.textContent = n.dataset.to; });

  /* specs */
  $('pspFig').innerHTML = '<img src="' + p.img + '.webp" alt="' + p.name + ' side profile" loading="lazy" decoding="async">' +
    '<figcaption>' + p.name + ' · ' + (p.frame === 'step' ? 'Step-through' : 'Step-over') + ' frame</figcaption>';
  var groups = [
    ['Motor & battery', [['Motor', x.motor], ['Peak torque', x.torque + ' N·m'], ['Top speed', x.speed + ' km/h'], ['Battery', x.battery],
      ['Range', 'Up to ' + p.range + ' km'], ['Charge time', x.charge + ' h (0 – 100%)']]],
    ['Frame & fit', [['Frame', '6061 aluminum · ' + (p.frame === 'step' ? 'step-through' : 'step-over')], ['Bike weight', x.weight + ' kg'],
      ['Max load', x.load + ' kg'], ['Suspension', x.sus], ['Rider height', D.sizes[x.sizes[0]].split(' – ')[0] + ' – ' + D.sizes[x.sizes[x.sizes.length - 1]].split(' – ')[1]]]],
    ['Ride & tech', [['Tires', x.tire], ['Brakes', x.brake], ['Drivetrain', x.gears], ['Display', '3.5" color LCD + app'],
      ['Lights', 'Integrated LED · 80 lux'], ['Water rating', 'IPX6']]]
  ];
  $('pspGroups').innerHTML = groups.map(function (g) {
    return '<div class="psp__group"><h3>' + g[0] + '</h3><dl>' + g[1].map(function (r) {
      return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
    }).join('') + '</dl></div>';
  }).join('');
  var more = document.querySelector('.psp__more');
  more.addEventListener('click', function () {
    var on = $('specs').classList.toggle('is-all');
    more.setAttribute('aria-expanded', String(on));
    more.textContent = on ? 'Show fewer specs' : 'Show all specs';
  });

  /* reviews */
  $('prvSum').innerHTML = '<p class="prv__score"><b>' + p.rate.toFixed(1) + '</b>' + stars(p.rate) + '<small>Based on ' + p.reviews + ' reviews</small></p>' +
    '<ul class="prv__dist">' + D.dist.map(function (v, i) {
      return '<li><span>' + (5 - i) + '★</span><i style="--w:' + v + '%"></i><small>' + v + '%</small></li>';
    }).join('') + '</ul>' +
    '<a class="hbtn hbtn--line prv__write" href="#reviews">Write a review</a>';
  $('prvList').innerHTML = D.reviews.map(function (r, i) {
    return '<li class="rv reveal" data-delay="' + (i % 3 + 1) + '"><div class="rv__top">' + stars(r.r) + '<time>' + r.d + '</time></div>' +
      '<h3>' + r.t + '</h3><p>' + r.x + '</p>' +
      '<footer><i>' + r.n.charAt(0) + '</i><span><b>' + r.n + ' <em>Verified</em></b><small>' + r.c + ' · ' + r.use + '</small></span></footer></li>';
  }).join('');

  /* related */
  $('prelList').innerHTML = d.items.filter(function (r) { return r.id !== p.id; }).slice(0, 4).map(function (r, i) {
    var url = 'product.html?id=' + r.id;
    return '<article class="pc" style="--i:' + i + ';--tone:' + sw(r.colors[0]).hex + '">' +
      '<a class="pc__pic" href="' + url + '" aria-label="' + r.name + '">' + (r.tag ? '<i class="pc__tag">' + r.tag + '</i>' : '') +
        '<img class="pc__img" src="' + r.img + '.webp" alt="" loading="lazy" decoding="async">' +
        '<img class="pc__frame" src="' + r.img + '-frame.webp" alt="" loading="lazy" decoding="async"></a>' +
      '<div class="pc__body"><h3 class="pc__name"><a href="' + url + '">' + r.name + '</a></h3><p class="pc__line">' + r.line + '</p>' +
        '<ul class="pc__specs">' + r.specs.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' +
        '<div class="pc__row"><p class="pc__price"><em>' + money(r.price) + '</em>' + (r.was ? '<s>' + money(r.was) + '</s>' : '') + '</p>' +
        '<button class="pc__add" type="button" data-add="' + r.id + '" aria-label="Add ' + r.name + ' to cart">' + ico.plus + ico.done + '<span>Add to cart</span></button></div>' +
      '</div></article>';
  }).join('');
  $('prelList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    if (window.TeswayCart) window.TeswayCart.add(b.dataset.add);
    b.classList.add('is-done');
    b.querySelector('span').textContent = 'Added';
    clearTimeout(b._t);
    b._t = setTimeout(function () { b.classList.remove('is-done'); b.querySelector('span').textContent = 'Add to cart'; }, 1600);
  });
})();
