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
