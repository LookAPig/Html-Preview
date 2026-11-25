(function () {
  var d = window.TESWAY_COLL;
  var root = document.getElementById('collFilter');
  if (!d || !root) return;

  var groups = d.filters;
  var state = {};
  var subs = [];
  groups.forEach(function (g) { state[g.id] = []; });

  var svg = function (p, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + p + '" pathLength="1"/></svg>';
  };
  function group(id) { return groups.filter(function (g) { return g.id === id; })[0]; }
  function opt(g, v) { return g.opts.filter(function (o) { return o.id === v; })[0]; }
  function match(p, g, o) {
    if (o.min != null) return p[g.id] >= o.min && p[g.id] < o.max;
    var v = p[g.id];
    return Array.isArray(v) ? v.indexOf(o.id) > -1 : v === o.id;
  }
  function pass(p, skip) {
    return groups.every(function (g) {
      var on = state[g.id];
      return g.id === skip || !on.length || g.opts.some(function (o) { return on.indexOf(o.id) > -1 && match(p, g, o); });
    });
  }

  var q = new URLSearchParams(location.search).get('c');
  if (q && opt(group('col'), q)) state.col = [q];

  function optHTML(g, o) {
    var a = ' type="button" data-g="' + g.id + '" data-v="' + o.id + '" aria-pressed="false"';
    if (g.type === 'chip') return '<button class="coll__chip"' + a + '>' + o.name + '</button>';
    return '<button class="cf__opt cf__opt--' + g.type + '"' + a + '><i class="cf__box">' +
      (g.type === 'check' ? svg('M6 12.5l4 4 8-9', 2.4) : '') + '</i><span>' + o.name + '</span><em></em></button>';
  }
  function grpHTML(g, i) {
    var opts = g.type === 'chip' ? [{ id: '', name: g.all }].concat(g.opts) : g.opts;
    return '<div class="cf__grp is-open" style="--i:' + i + '">' +
      '<h3><button class="cf__ghead" type="button" aria-expanded="true" aria-controls="cf-' + g.id + '">' + g.name +
        '<i class="cf__n"></i>' + svg('m6 9 6 6 6-6') + '</button></h3>' +
      '<div class="cf__gbody" id="cf-' + g.id + '"><div><div class="cf__opts cf__opts--' + g.type + '">' +
        opts.map(function (o) { return optHTML(g, o); }).join('') + '</div></div></div></div>';
  }

  root.innerHTML = '<div class="cf__scrim" data-close></div>' +
    '<div class="cf__panel" role="dialog" aria-labelledby="cfTitle">' +
      '<div class="cf__head"><i class="cf__grab" aria-hidden="true"></i><h2 id="cfTitle">Filters</h2>' +
        '<button class="cf__clear" type="button" data-clear>Clear all</button>' +
        '<button class="arw cf__x" type="button" data-close aria-label="Close filters">' + svg('M6 6l12 12M18 6 6 18') + '</button></div>' +
      '<div class="cf__body">' + groups.map(grpHTML).join('') + '</div>' +
      '<div class="cf__foot"><button class="hbtn hbtn--line" type="button" data-clear>Clear all</button>' +
        '<button class="hbtn cf__show" type="button" data-close></button></div>' +
    '</div>';

  var panel = root.querySelector('.cf__panel');
  var show = root.querySelector('.cf__show');
  var grps = root.querySelectorAll('.cf__grp');
  var btns = root.querySelectorAll('[data-g]');

  function active() {
    var out = [];
    groups.forEach(function (g) {
      state[g.id].forEach(function (v) { out.push({ g: g.id, v: v, name: opt(g, v).name }); });
    });
    return out;
  }

  function sync() {
    btns.forEach(function (b) {
      var g = group(b.dataset.g), v = b.dataset.v;
      var on = v ? state[g.id].indexOf(v) > -1 : !state[g.id].length;
      var n = v ? d.items.filter(function (p) { return pass(p, g.id) && match(p, g, opt(g, v)); }).length : 1;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
      b.disabled = !on && !n;
      var em = b.querySelector('em');
      if (em) em.textContent = '(' + n + ')';
    });
    grps.forEach(function (el, i) { el.querySelector('.cf__n').textContent = state[groups[i].id].length || ''; });
    var total = d.items.filter(function (p) { return pass(p); }).length;
    show.textContent = 'Show ' + total + (total === 1 ? ' bike' : ' bikes');
    root.classList.toggle('has-on', active().length > 0);
    subs.forEach(function (fn) { fn(); });
  }

  function toggle(id, v) {
    var g = group(id), cur = state[id], i = cur.indexOf(v);
    if (!v) state[id] = [];
    else if (g.type === 'check') { if (i > -1) cur.splice(i, 1); else cur.push(v); }
    else state[id] = i > -1 ? [] : [v];
    if (id === 'col') history.replaceState(null, '', (state.col[0] ? '?c=' + state.col[0] : location.pathname) + location.hash);
    sync();
  }
  function clear() {
    groups.forEach(function (g) { state[g.id] = []; });
    history.replaceState(null, '', location.pathname + location.hash);
    sync();
  }

  var last;
  function open() {
    last = document.activeElement;
    root.classList.add('is-on');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { root.querySelector('.cf__x').focus({ preventScroll: true }); }, 60);
    subs.forEach(function (fn) { fn(true); });
  }
  function close() {
    if (!root.classList.contains('is-on')) return;
    root.classList.remove('is-on');
    document.body.style.overflow = '';
    if (last) last.focus({ preventScroll: true });
    subs.forEach(function (fn) { fn(false); });
  }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-g], [data-clear], [data-close], .cf__ghead');
    if (!t) return;
    if (t.dataset.g) return toggle(t.dataset.g, t.dataset.v);
    if ('clear' in t.dataset) return clear();
    if ('close' in t.dataset) return close();
    var grp = t.closest('.cf__grp');
    t.setAttribute('aria-expanded', String(grp.classList.toggle('is-open')));
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  matchMedia('(min-aspect-ratio: 1/1)').addEventListener('change', close);

  var y0 = null, dy = 0;
  var head = root.querySelector('.cf__head');
  head.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientY; dy = 0; panel.style.transition = 'none'; }, { passive: true });
  head.addEventListener('touchmove', function (e) {
    if (y0 == null) return;
    dy = Math.max(0, e.touches[0].clientY - y0);
    panel.style.translate = '0 ' + dy + 'px';
  }, { passive: true });
  head.addEventListener('touchend', function () {
    panel.style.transition = panel.style.translate = '';
    if (dy > 90) close();
    y0 = null;
  });

  window.TeswayFilter = {
    pass: function (p) { return pass(p); },
    active: active,
    toggle: toggle,
    clear: clear,
    open: open,
    onChange: function (fn) { subs.push(fn); }
  };
  sync();
})();
