/* ==== cart-data.js ==== */
window.TESWAY_CART = {
  cur: '$',
  freeShip: 2000,
  shipFee: 79,
  products: [
    { id: 'dual', name: 'X1 Dual-Drive', variant: 'Graphite · Size M', img: 'Images/bike-dual.jpg', price: 1899, was: 2299 },
    { id: 'trail', name: 'X1 Trail Pro', variant: 'Sand · Size L', img: 'Images/bike-trail.jpg', price: 2399 },
    { id: 'family', name: 'X1 Family', variant: 'Ivory · One size', img: 'Images/bike-family.jpg', price: 1699 },
    { id: 'cargo', name: 'X1 Cargo', variant: 'Black · One size', img: 'Images/bike-cargo.jpg', price: 1999 },
    { id: 'city', name: 'X1 City', variant: 'Graphite · Size M', img: 'Images/bike-city.jpg', price: 1499 },
    { id: 'citystep', name: 'X1 City Step', variant: 'Ivory · Size S', img: 'Images/bike-city.jpg', price: 1399 },
    { id: 'helmet', name: 'Trail helmet', variant: 'MIPS · M/L', price: 89,
      icon: '<path d="M4 15a8 8 0 0 1 16 0v1H4z"/><path d="M9 8.2c1.2 1.4 1.8 3.6 1.8 6.8M15 8.2c-1.2 1.4-1.8 3.6-1.8 6.8"/><path d="M4 16h16l-1.2 2.4H5.2z"/>' },
    { id: 'lock', name: 'U-lock pro', variant: 'Sold Secure Gold', price: 59,
      icon: '<path d="M7.5 11V8.5a4.5 4.5 0 0 1 9 0V11"/><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M12 14.5v2"/>' },
    { id: 'bag', name: 'Pannier bag', variant: '24 L · Waterproof', price: 79,
      icon: '<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/><path d="M9.5 12h5"/>' },
    { id: 'battery', name: 'Spare battery', variant: '48V · 20Ah', price: 349,
      icon: '<rect x="7" y="4.5" width="10" height="16" rx="2"/><path d="M10 3h4"/><path d="m12.8 8.5-2.3 4h3l-2.3 4"/>' }
  ],
  start: [['dual', 1], ['helmet', 1]],
  addons: ['helmet', 'lock', 'bag', 'battery'],
  text: {
    title: 'Your cart',
    shipLeft: 'Add <b>{x}</b> more for <b>free shipping</b>',
    shipDone: 'You have unlocked <b>free shipping</b>',
    empty: 'Your cart is empty',
    emptySub: 'Find the TESWAY that fits your ride.',
    emptyCta: 'Shop best sellers',
    addons: 'Ride-ready add-ons',
    note: 'Taxes calculated at checkout · 30-day returns · 2-year warranty',
    checkout: 'Checkout',
    going: 'Securing checkout…'
  }
};

/* ==== cart-view.js ==== */
(function () {
  var d = window.TESWAY_CART;
  if (!d) return;

  var svg = function (body, cls) {
    return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  };
  var ico = {
    x: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
    minus: svg('<path d="M6 12h12"/>'),
    plus: svg('<path d="M12 6v12M6 12h12"/>'),
    trash: svg('<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>'),
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    cart: svg('<path d="M3.8 5.2h2l2 9.4h10l1.7-6.6H8.4"/><circle cx="10" cy="17.6" r="1.2"/><circle cx="16.4" cy="17.6" r="1.2"/>')
  };

  function money(n) { return d.cur + n.toLocaleString('en-US'); }

  function pic(p) {
    return p.img
      ? '<span class="ci__pic"><img src="' + p.img + '" alt="" loading="lazy" decoding="async"></span>'
      : '<span class="ci__pic is-ico">' + svg(p.icon) + '</span>';
  }

  function price(p, qty) {
    return (p.was ? '<s>' + money(p.was * qty) + '</s>' : '') + '<em>' + money(p.price * qty) + '</em>';
  }

  function line(p, qty) {
    return '<li class="ci" data-id="' + p.id + '">' + pic(p) +
      '<div class="ci__info">' +
        '<div class="ci__top"><div><b>' + p.name + '</b><small>' + p.variant + '</small></div>' +
          '<button class="ci__rm" type="button" data-rm aria-label="Remove ' + p.name + '">' + ico.trash + '</button></div>' +
        '<div class="ci__row">' +
          '<div class="qty" role="group" aria-label="Quantity">' +
            '<button type="button" data-q="-1" aria-label="Decrease">' + ico.minus + '</button>' +
            '<output aria-live="polite">' + qty + '</output>' +
            '<button type="button" data-q="1" aria-label="Increase">' + ico.plus + '</button></div>' +
          '<span class="ci__price">' + price(p, qty) + '</span>' +
        '</div></div></li>';
  }

  function addon(p) {
    return '<button class="add" type="button" data-add="' + p.id + '">' +
      '<span class="add__pic">' + svg(p.icon) + '</span>' +
      '<span class="add__txt"><b>' + p.name + '</b><small>' + money(p.price) + '</small></span>' +
      '<i class="add__plus">' + ico.plus + '</i></button>';
  }

  function shell() {
    var t = d.text;
    return '<div class="cart__scrim" data-close></div>' +
      '<div class="cart__panel">' +
        '<header class="cart__head"><h2 id="cartTitle">' + t.title + '<sup class="cart__count">0</sup></h2>' +
          '<button class="cart__x" type="button" data-close aria-label="Close cart">' + ico.x + '</button></header>' +
        '<div class="cart__ship"><p class="cart__ship-txt"></p><span class="cart__bar"><i></i></span></div>' +
        '<div class="cart__body">' +
          '<ul class="cart__list"></ul>' +
          '<div class="cart__empty"><span class="cart__empty-ico">' + ico.cart + '</span><b>' + t.empty + '</b><p>' + t.emptySub + '</p>' +
            '<a class="hbtn cart__shop" href="#hot" data-close>' + t.emptyCta + ico.arrow + '</a></div>' +
          '<div class="cart__more"><p class="eyebrow">' + t.addons + '</p><div class="cart__adds"></div></div>' +
        '</div>' +
        '<footer class="cart__foot">' +
          '<dl class="cart__sum"><div><dt>Subtotal</dt><dd class="cart__sub"></dd></div>' +
            '<div><dt>Shipping</dt><dd class="cart__fee"></dd></div></dl>' +
          '<button class="hbtn cart__go" type="button"><span class="cart__go-txt">' + t.checkout + '</span><b class="cart__total"></b>' + ico.arrow + '</button>' +
          '<p class="cart__note">' + t.note + '</p>' +
        '</footer>' +
      '</div>';
  }

  window.TeswayCartView = { money: money, price: price, line: line, addon: addon, shell: shell };
})();

/* ==== cart.js ==== */
(function () {
  var d = window.TESWAY_CART;
  var v = window.TeswayCartView;
  var btn = document.getElementById('navCart');
  if (!d || !v || !btn) return;

  var KEY = 'tesway-cart';
  var body = document.body;
  var badge = btn.querySelector('.nav__badge');
  var cat = {};
  d.products.forEach(function (p) { cat[p.id] = p; });

  var lines = load();
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (Array.isArray(s)) return s.filter(function (l) { return cat[l[0]] && l[1] > 0; });
    } catch (e) {}
    return d.start.slice();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch (e) {} }
  function find(id) { for (var i = 0; i < lines.length; i++) if (lines[i][0] === id) return lines[i]; return null; }

  var root = document.createElement('aside');
  root.className = 'cart';
  root.id = 'cart';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'cartTitle');
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = v.shell();
  body.appendChild(root);

  var $ = function (s) { return root.querySelector(s); };
  var list = $('.cart__list');
  var adds = $('.cart__adds');
  var go = $('.cart__go');
  var back = null;

  list.innerHTML = lines.map(function (l) { return v.line(cat[l[0]], l[1]); }).join('');
  adds.innerHTML = d.addons.map(function (id) { return v.addon(cat[id]); }).join('');

  function sync() {
    var count = 0, sub = 0;
    lines.forEach(function (l) { count += l[1]; sub += cat[l[0]].price * l[1]; });
    var left = d.freeShip - sub;
    var fee = !count || left <= 0 ? 0 : d.shipFee;
    root.classList.toggle('is-empty', !count);
    $('.cart__count').textContent = count;
    $('.cart__sub').textContent = v.money(sub);
    $('.cart__fee').textContent = fee ? v.money(fee) : 'Free';
    $('.cart__total').textContent = v.money(sub + fee);
    $('.cart__ship-txt').innerHTML = left > 0 ? d.text.shipLeft.replace('{x}', v.money(left)) : d.text.shipDone;
    $('.cart__ship').classList.toggle('is-done', left <= 0);
    $('.cart__bar i').style.transform = 'scaleX(' + Math.min(1, sub / d.freeShip).toFixed(4) + ')';
    adds.querySelectorAll('.add').forEach(function (a) {
      a.classList.toggle('is-in', !!find(a.dataset.add));
    });
    badge.textContent = count;
    badge.dataset.count = count;
    save();
  }

  function bump() {
    badge.classList.remove('is-bump');
    void badge.offsetWidth;
    badge.classList.add('is-bump');
  }

  function setQty(id, qty) {
    var l = find(id);
    var row = list.querySelector('[data-id="' + id + '"]');
    if (qty <= 0) {
      lines = lines.filter(function (x) { return x[0] !== id; });
      if (row) {
        row.style.height = row.offsetHeight + 'px';
        requestAnimationFrame(function () { row.classList.add('is-out'); });
        setTimeout(function () { row.remove(); }, 420);
      }
    } else if (l && row) {
      l[1] = qty;
      row.querySelector('output').textContent = qty;
      row.querySelector('.ci__price').innerHTML = v.price(cat[id], qty);
      row.classList.remove('is-tick');
      void row.offsetWidth;
      row.classList.add('is-tick');
    } else {
      lines.push([id, qty]);
      list.insertAdjacentHTML('beforeend', v.line(cat[id], qty));
      list.lastElementChild.classList.add('is-new');
      bump();
    }
    sync();
  }

  function add(id, qty) {
    if (!cat[id]) return;
    var l = find(id);
    setQty(id, (l ? l[1] : 0) + (qty || 1));
    if (l) bump();
  }

  function open() {
    if (root.classList.contains('is-on')) return;
    if (body.classList.contains('menu-open')) document.getElementById('navToggle').click();
    back = document.activeElement;
    root.setAttribute('aria-hidden', 'false');
    root.classList.add('is-on');
    btn.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
    setTimeout(function () { $('.cart__x').focus({ preventScroll: true }); }, 60);
  }
  function close() {
    if (!root.classList.contains('is-on')) return;
    root.classList.remove('is-on');
    root.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
    if (back) back.focus({ preventScroll: true });
  }

  btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-close], [data-q], [data-rm], [data-add], .cart__go');
    if (!t) return;
    var row = t.closest('.ci');
    if (row && !find(row.dataset.id)) return;
    if (t.hasAttribute('data-close')) close();
    else if (t.hasAttribute('data-q')) setQty(row.dataset.id, find(row.dataset.id)[1] + Number(t.dataset.q));
    else if (t.hasAttribute('data-rm')) setQty(row.dataset.id, 0);
    else if (t.hasAttribute('data-add')) find(t.dataset.add) ? setQty(t.dataset.add, 0) : add(t.dataset.add);
    else if (!go.disabled) {
      go.disabled = true;
      $('.cart__go-txt').textContent = d.text.going;
      setTimeout(function () { go.disabled = false; $('.cart__go-txt').textContent = d.text.checkout; }, 1800);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (!root.classList.contains('is-on')) return;
    if (e.key === 'Escape') close();
    if (e.key !== 'Tab') return;
    var f = root.querySelectorAll('.cart__panel button:not([disabled]), .cart__panel a[href]');
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  sync();
  window.TeswayCart = { open: open, close: close, add: add };
})();
