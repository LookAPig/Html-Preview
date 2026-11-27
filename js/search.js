/* ==== search-data.js ==== */
window.TESWAY_SEARCH = {
  hints: ['long range', 'bike for kids', 'cargo bike', 'steep hills', 'spare battery'],
  trending: ['X1 Dual-Drive', 'Black Friday deals', 'Long range', 'Family bike', 'Cargo', 'Test ride'],
  picks: ['dual', 'trail', 'family', 'cargo'],
  specs: {
    dual: '160 km range · 120 N·m',
    trail: '140 km range · 30° climb',
    family: '150 kg payload · low step',
    cargo: '50 kg rack · 160 km range'
  },
  intents: [
    { keys: ['range', 'long', 'far', 'tour', 'commut', 'distance', 'battery life'], id: 'dual', why: 'Up to 160 km on a single charge' },
    { keys: ['hill', 'climb', 'steep', 'mountain', 'trail', 'off-road', 'offroad', 'hunt'], id: 'trail', why: 'Full suspension and a 30° climb rating' },
    { keys: ['kid', 'child', 'family', 'school', 'seat', 'mom', 'dad'], id: 'family', why: 'Child seat ready with a low step-through frame' },
    { keys: ['cargo', 'deliver', 'haul', 'carry', 'load', 'camp', 'farm'], id: 'cargo', why: '50 kg rear rack, built to haul all day' },
    { keys: ['dual', 'motor', 'power', 'fast', 'torque', 'fish'], id: 'dual', why: 'Two motors and 120 N·m of torque' }
  ],
  help: [
    { title: 'Shipping & delivery times', keys: 'shipping delivery order track', href: '#foot' },
    { title: 'Returns within 30 days', keys: 'return refund exchange', href: '#foot' },
    { title: '2-year warranty coverage', keys: 'warranty repair broken', href: '#foot' },
    { title: 'Book a free test ride', keys: 'test ride dealer store try', href: '#top' },
    { title: 'Battery care & charging', keys: 'battery charge charging care winter', href: '#blog' },
    { title: 'Financing from 0% APR', keys: 'finance pay monthly klarna installment', href: '#foot' }
  ],
  text: {
    placeholder: 'Search bikes, gear, rides…',
    trending: 'Trending searches',
    recent: 'Recent searches',
    clear: 'Clear',
    picks: 'Recommended for you',
    best: 'Best match for you',
    none: 'No results for',
    noneSub: 'Check the spelling or try one of these instead.',
    all: 'See all results'
  }
};

/* ==== search-index.js ==== */
(function () {
  var s = window.TESWAY_SEARCH;
  var cart = window.TESWAY_CART;
  if (!s || !cart) return;

  var items = [];
  var byId = {};
  cart.products.forEach(function (p) {
    var bike = !!p.img;
    var it = {
      type: bike ? 'bike' : 'gear', id: p.id, title: p.name, img: p.img, icon: p.icon, price: p.price, was: p.was,
      sub: bike ? s.specs[p.id] || p.variant : p.variant, href: '#hot',
      text: p.variant + ' ' + (s.specs[p.id] || '')
    };
    byId[p.id] = it;
    items.push(it);
  });
  (window.TESWAY_USES || []).forEach(function (u) {
    items.push({ type: 'scene', title: u.name, sub: 'Best with ' + u.bike, img: u.img, href: '#uses', text: u.desc + ' ' + u.tags.join(' ') + ' ' + u.bike });
  });
  ((window.TESWAY_BLOG || {}).posts || []).forEach(function (p) {
    items.push({ type: 'story', title: p.title, sub: p.cat + ' · ' + p.read + ' min read', img: p.img, href: '#blog', text: p.text + ' ' + p.cat });
  });
  s.help.forEach(function (h) {
    items.push({ type: 'help', title: h.title, sub: 'Help center', href: h.href, text: h.keys });
  });

  var terms = s.trending.concat(s.hints, items.filter(function (i) { return i.type !== 'story'; }).map(function (i) { return i.title; }));
  var seen = {};
  terms = terms.filter(function (t) {
    var k = t.toLowerCase();
    return seen[k] ? false : (seen[k] = true);
  });

  function norm(q) { return String(q || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function tokens(q) { return norm(q).split(' ').filter(Boolean); }
  function loose(hay, t) {
    if (t.length < 3) return false;
    for (var s0 = hay.indexOf(t[0]); s0 > -1; s0 = hay.indexOf(t[0], s0 + 1)) {
      var i = 1, j = s0 + 1, end = s0 + t.length + 2;
      for (; j < hay.length && j <= end && i < t.length; j++) if (hay[j] === t[i]) i++;
      if (i === t.length) return true;
    }
    return false;
  }

  function score(it, ts) {
    var title = norm(it.title);
    var text = norm(it.text);
    var total = 0, hit = 0;
    for (var i = 0; i < ts.length; i++) {
      var t = ts[i];
      var sc = title.indexOf(t) === 0 ? 6
        : (' ' + title).indexOf(' ' + t) > -1 ? 4
        : title.indexOf(t) > -1 ? 3
        : text.indexOf(t) > -1 ? 1.5
        : loose(title.replace(/\s/g, ''), t) ? 0.75 : 0;
      if (sc) hit++;
      total += sc;
    }
    if (hit * 2 < ts.length || !hit) return 0;
    total *= hit / ts.length;
    return total + (it.type === 'bike' ? 1 : it.type === 'gear' ? 0.5 : 0);
  }

  function find(q) {
    var ts = tokens(q);
    var groups = { bike: [], gear: [], scene: [], story: [], help: [] };
    if (!ts.length) return groups;
    items.map(function (it) { return { it: it, sc: score(it, ts) }; })
      .filter(function (r) { return r.sc > 0; })
      .sort(function (a, b) { return b.sc - a.sc; })
      .forEach(function (r) { groups[r.it.type].push(r.it); });
    return groups;
  }

  function suggest(q) {
    var n = norm(q);
    if (n.length < 1) return [];
    return terms.map(function (t) {
      var l = norm(t);
      return { t: t, i: l.indexOf(n) === 0 ? 0 : (' ' + l).indexOf(' ' + n) > -1 ? 1 : l.indexOf(n) > -1 ? 2 : -1 };
    }).filter(function (r) { return r.i > -1 && norm(r.t) !== n; })
      .sort(function (a, b) { return a.i - b.i || a.t.length - b.t.length; })
      .slice(0, 5).map(function (r) { return r.t; });
  }

  function intent(q) {
    var n = norm(q);
    if (n.length < 3) return null;
    for (var i = 0; i < s.intents.length; i++) {
      var m = s.intents[i];
      for (var k = 0; k < m.keys.length; k++) {
        if (n.indexOf(m.keys[k]) > -1 || (m.keys[k].indexOf(n) === 0)) return { item: byId[m.id], why: m.why };
      }
    }
    return null;
  }

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mark(text, q) {
    var ts = tokens(q).filter(function (t) { return t.length > 1; });
    var out = esc(text);
    if (!ts.length) return out;
    var re = new RegExp('(' + ts.map(function (t) { return t.replace(/[-]/g, '\\-'); }).join('|') + ')', 'ig');
    return out.replace(re, '<mark>$1</mark>');
  }

  window.TeswaySearchIndex = { find: find, suggest: suggest, intent: intent, mark: mark, esc: esc, byId: byId };
})();

/* ==== search-view.js ==== */
(function () {
  var s = window.TESWAY_SEARCH;
  var ix = window.TeswaySearchIndex;
  var money = window.TeswayCartView && window.TeswayCartView.money;
  if (!s || !ix || !money) return;

  var t = s.text;
  var svg = function (b) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + b + '</svg>';
  };
  var ico = {
    find: svg('<circle cx="11" cy="11" r="5.5"/><path d="m15.2 15.2 4 4"/>'),
    clock: svg('<circle cx="12" cy="12" r="7.5"/><path d="M12 8v4l2.5 1.5"/>'),
    trend: svg('<path d="m4 16 5-5 3.5 3.5L20 7"/><path d="M15 7h5v5"/>'),
    fill: svg('<path d="M17 17 7 7M7 15V7h8"/>'),
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    plus: svg('<path d="M12 6v12M6 12h12"/>'),
    spark: svg('<path d="M12 3.5 13.8 10 20.5 12 13.8 14 12 20.5 10.2 14 3.5 12 10.2 10z"/>'),
    x: svg('<path d="M6 6l12 12M18 6 6 18"/>')
  };
  var labels = { bike: 'Bikes', gear: 'Gear', scene: 'Ride scenes', story: 'Stories', help: 'Help' };

  function head(label, extra) {
    return '<div class="srch__head"><p class="eyebrow">' + label + '</p>' + (extra || '') + '</div>';
  }
  function sec(cls, label, html, extra) {
    return '<div class="srch__sec ' + cls + '">' + head(label, extra) + html + '</div>';
  }
  function chips(list, icon) {
    return '<div class="srch__chips">' + list.map(function (term, i) {
      return '<button class="srch__chip srch__opt" type="button" data-term="' + ix.esc(term) + '" style="--i:' + i + '">' + icon + '<span>' + ix.esc(term) + '</span></button>';
    }).join('') + '</div>';
  }
  function price(it) {
    return '<span class="srch__price">' + (it.was ? '<s>' + money(it.was) + '</s>' : '') + money(it.price) + '</span>';
  }
  function add(it) {
    return '<button class="srch__add" type="button" data-add="' + it.id + '" aria-label="Add ' + ix.esc(it.title) + ' to cart">' + ico.plus + '</button>';
  }
  function card(it, q, i) {
    return '<div class="srch__card srch__opt" role="option" data-go="' + it.href + '" style="--i:' + i + '">' +
      '<span class="srch__pic"><img src="' + it.img + '" alt="" loading="lazy" decoding="async"></span>' +
      '<span class="srch__card-txt"><b>' + ix.mark(it.title, q) + '</b><small>' + ix.esc(it.sub) + '</small>' +
      '<span class="srch__card-row">' + price(it) + add(it) + '</span></span></div>';
  }
  function cards(list, q) {
    return '<div class="srch__cards">' + list.map(function (it, i) { return card(it, q, i); }).join('') + '</div>';
  }
  function row(it, q, i) {
    var pic = it.img ? '<span class="srch__thumb"><img src="' + it.img + '" alt="" loading="lazy"></span>'
      : '<span class="srch__thumb is-ico">' + (it.icon ? svg(it.icon) : ico.arrow) + '</span>';
    var end = it.type === 'gear' ? price(it) + add(it) : '<i class="srch__go">' + ico.arrow + '</i>';
    return '<div class="srch__row srch__opt" role="option" data-go="' + it.href + '" style="--i:' + i + '">' + pic +
      '<span class="srch__row-txt"><b>' + ix.mark(it.title, q) + '</b><small>' + ix.esc(it.sub) + '</small></span>' + end + '</div>';
  }
  function picks(q) {
    return sec('srch__picks', t.picks, cards(s.picks.map(function (id) { return ix.byId[id]; }), q));
  }
  function words(recent) {
    var rec = recent.length ? sec('', t.recent, chips(recent, ico.clock), '<button class="srch__clr" type="button" data-clear>' + t.clear + '</button>') : '';
    return '<div class="srch__words">' + rec + sec('', t.trending, chips(s.trending, ico.trend)) + '</div>';
  }

  function idle(recent) { return words(recent) + picks(''); }

  function best(m) {
    var it = m.item;
    return '<div class="srch__sec"><div class="srch__best srch__opt" role="option" data-go="' + it.href + '">' +
      '<span class="srch__best-pic"><img src="' + it.img + '" alt="" decoding="async"></span>' +
      '<span class="srch__best-txt"><em>' + ico.spark + t.best + '</em><b>' + ix.esc(it.title) + '</b><small>' + ix.esc(m.why) + '</small>' +
      '<span class="srch__card-row">' + price(it) + '<button class="hbtn srch__buy" type="button" data-add="' + it.id + '">Add to cart</button></span></span></div></div>';
  }

  function results(q, g, sug, m) {
    if (m) g.bike = g.bike.filter(function (it) { return it !== m.item; });
    var total = g.bike.length + g.gear.length + g.scene.length + g.story.length + g.help.length;
    var sugHtml = sug.length ? '<div class="srch__sec srch__sugw"><ul class="srch__sug">' + sug.slice(0, 4).map(function (w, i) {
      return '<li class="srch__opt" role="option" data-term="' + ix.esc(w) + '" style="--i:' + i + '">' + ico.find +
        '<span>' + ix.mark(w, q) + '</span><button class="srch__fill" type="button" data-fill="' + ix.esc(w) + '" aria-label="Use ' + ix.esc(w) + '">' + ico.fill + '</button></li>';
    }).join('') + '</ul></div>' : '';
    if (!total && !m) {
      return '<div class="srch__words"><div class="srch__sec srch__none"><b>' + t.none + ' “' + ix.esc(q) + '”</b><p>' + t.noneSub + '</p></div>' +
        sec('', t.trending, chips(s.trending, ico.trend)) + '</div>' + picks(q);
    }
    var budget = sug.length > 2 ? 4 : 5;
    var list = ['gear', 'scene', 'story', 'help'].filter(function (k) { return g[k].length; }).map(function (k) {
      var take = Math.min(g[k].length, Math.max(0, budget), 3);
      budget -= take;
      return take ? sec('', labels[k] + ' <i>' + g[k].length + '</i>', g[k].slice(0, take).map(function (it, i) { return row(it, q, i); }).join('')) : '';
    }).join('');
    var bikes = g.bike.length ? sec('', labels.bike + ' <i>' + g.bike.length + '</i>', cards(g.bike.slice(0, m ? 2 : 3), q)) : '';
    var side = (m ? best(m) : '') + (bikes || (m ? '' : sec('', t.picks, cards(s.picks.slice(0, 3).map(function (id) { return ix.byId[id]; }), q))));
    return sugHtml + '<div class="srch__col">' + list + '</div><div class="srch__col srch__side">' + side + '</div>';
  }

  function shell() {
    return '<div class="srch__scrim" data-close></div>' +
      '<div class="srch__panel">' +
        '<form class="srch__bar" role="search" autocomplete="off">' + ico.find +
          '<input class="srch__input" type="search" enterkeyhint="search" placeholder="' + t.placeholder + '" aria-label="Search TESWAY" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="srchBody">' +
          '<button class="srch__wipe" type="button" aria-label="Clear search">' + ico.x + '</button>' +
          '<button class="srch__close" type="button" data-close>Cancel</button>' +
          '<kbd class="srch__kbd">Esc</kbd></form>' +
        '<div class="srch__body" id="srchBody" role="listbox" aria-label="Search suggestions"></div>' +
      '</div>';
  }

  window.TeswaySearchView = { idle: idle, results: results, shell: shell };
})();

/* ==== search.js ==== */
(function () {
  var s = window.TESWAY_SEARCH;
  var ix = window.TeswaySearchIndex;
  var v = window.TeswaySearchView;
  var btn = document.getElementById('navSearch');
  if (!s || !ix || !v || !btn) return;

  var KEY = 'tesway-search-recent';
  var body = document.body;
  var root = document.createElement('div');
  root.className = 'srch';
  root.id = 'search';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Search');
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = v.shell();
  body.appendChild(root);

  var input = root.querySelector('.srch__input');
  var box = root.querySelector('.srch__body');
  var form = root.querySelector('.srch__bar');
  var timer = 0, hintTimer = 0, hintI = 0, act = -1, back = null;

  function recent() {
    try { var r = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(r) ? r : []; } catch (e) { return []; }
  }
  function remember(q) {
    q = q.trim();
    if (!q) return;
    var r = recent().filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); });
    r.unshift(q);
    try { localStorage.setItem(KEY, JSON.stringify(r.slice(0, 5))); } catch (e) {}
  }

  function render() {
    var q = input.value.trim();
    root.classList.toggle('has-q', !!q);
    act = -1;
    input.removeAttribute('aria-activedescendant');
    box.innerHTML = q ? v.results(q, ix.find(q), ix.suggest(q), ix.intent(q)) : v.idle(recent());
    box.querySelectorAll('.srch__opt').forEach(function (o, i) { o.id = 'srchOpt' + i; });
    box.classList.remove('is-swap');
    void box.offsetWidth;
    box.classList.add('is-swap');
    box.scrollTop = 0;
  }

  function opts() { return box.querySelectorAll('.srch__opt'); }
  function move(d) {
    var o = opts();
    if (!o.length) return;
    if (o[act]) o[act].classList.remove('is-act');
    act = (act + 1 + d + o.length + 1) % (o.length + 1) - 1;
    if (act < 0) { input.removeAttribute('aria-activedescendant'); return; }
    o[act].classList.add('is-act');
    o[act].scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', o[act].id);
  }

  function setQ(q) { input.value = q; render(); input.focus({ preventScroll: true }); }
  function go(href) {
    remember(input.value);
    close();
    var el = href && document.querySelector(href);
    if (el && window.TeswayScrollTo) window.TeswayScrollTo(el, true);
    else if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function hint() {
    if (input.value) return;
    input.placeholder = 'Try “' + s.hints[hintI++ % s.hints.length] + '”';
  }

  function open() {
    if (root.classList.contains('is-on')) return;
    if (body.classList.contains('menu-open')) document.getElementById('navToggle').click();
    if (window.TeswayCart) window.TeswayCart.close();
    back = document.activeElement;
    root.style.setProperty('--base', '.3s');
    render();
    setTimeout(function () { root.style.setProperty('--base', '0s'); }, 1300);
    root.setAttribute('aria-hidden', 'false');
    root.classList.add('is-on');
    btn.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
    input.placeholder = s.text.placeholder;
    hintTimer = setInterval(hint, 2800);
    setTimeout(function () { input.focus({ preventScroll: true }); }, 80);
  }
  function close() {
    if (!root.classList.contains('is-on')) return;
    root.classList.remove('is-on');
    root.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
    clearInterval(hintTimer);
    input.blur();
    if (back) back.focus({ preventScroll: true });
  }

  btn.addEventListener('click', open);
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(render, 110);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var o = opts()[act];
    if (o) return o.click();
    var first = box.querySelector('.srch__best, .srch__card, .srch__row');
    if (first && input.value.trim()) go(first.dataset.go);
  });
  root.querySelector('.srch__wipe').addEventListener('click', function () { setQ(''); });

  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-close], [data-clear], [data-fill], [data-add], [data-term], [data-go]');
    if (!el) return;
    if (el.hasAttribute('data-close')) close();
    else if (el.hasAttribute('data-clear')) { localStorage.removeItem(KEY); render(); }
    else if (el.hasAttribute('data-fill')) setQ(el.dataset.fill + ' ');
    else if (el.hasAttribute('data-add')) {
      remember(input.value);
      close();
      if (window.TeswayCart) { window.TeswayCart.add(el.dataset.add); window.TeswayCart.open(); }
    } else if (el.hasAttribute('data-term')) { remember(el.dataset.term); setQ(el.dataset.term); }
    else go(el.dataset.go);
  });

  document.addEventListener('keydown', function (e) {
    var on = root.classList.contains('is-on');
    var typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (!on && ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)))) {
      e.preventDefault();
      return open();
    }
    if (!on) return;
    if (e.key === 'Escape') { e.preventDefault(); input.value ? setQ('') : close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
  });

  window.TeswaySearch = { open: open, close: close };
})();
