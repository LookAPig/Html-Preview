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
