(function () {
  var d = window.TESWAY_COLL;
  var F = window.TeswayFilter;
  var bar = document.getElementById('collBar');
  var grid = document.getElementById('collGrid');
  if (!d || !F || !bar || !grid) return;

  var svg = function (p) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + p + '"/></svg>';
  };
  var ico = {
    plus: svg('M12 6v12M6 12h12'),
    done: svg('M6 12.5l4 4 8-9'),
    x: svg('M7 7l10 10M17 7 7 17'),
    filter: svg('M4 7h10M18 7h2M4 17h4M12 17h8M14 4.5v5M8 14.5v5')
  };
  var money = function (n) { return '$' + n.toLocaleString('en-US'); };
  var sort = 'featured';

  bar.innerHTML =
    '<button class="coll__fbtn" type="button" aria-controls="collFilter" aria-expanded="false">' + ico.filter + 'Filter<i></i></button>' +
    '<p class="coll__count" aria-live="polite"></p>' +
    '<label class="coll__sort"><span>Sort</span><span class="coll__select"><select>' + d.sorts.map(function (s) {
      return '<option value="' + s.id + '">' + s.name + '</option>';
    }).join('') + '</select></span></label>' +
    '<ul class="coll__active" aria-label="Active filters"></ul>';

  var fbtn = bar.querySelector('.coll__fbtn');
  var sel = bar.querySelector('select');
  var countEl = bar.querySelector('.coll__count');
  var act = bar.querySelector('.coll__active');

  var star = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5l1.9 4 4.4.5-3.3 3 .9 4.3L8 11.1l-3.9 2.2.9-4.3-3.3-3 4.4-.5z"/></svg>';
  var sw = function (k) { return d.swatches[k]; };

  function meta(p) {
    var c = p.colors || [];
    return '<div class="pc__meta">' +
      (c.length ? '<div class="pc__sw" role="radiogroup" aria-label="Color for ' + p.name + '">' + c.map(function (k, j) {
        return '<button class="pc__dot' + (j ? '' : ' is-on') + '" type="button" role="radio" aria-checked="' + !j + '" data-sw="' + k + '" aria-label="' + sw(k).name + '" title="' + sw(k).name + '" style="--c:' + sw(k).hex + '"></button>';
      }).join('') + '</div><span class="pc__cname"><span>' + sw(c[0]).name + '</span></span>' : '') +
      '<p class="pc__rate" aria-label="Rated ' + p.rate + ' out of 5 from ' + p.reviews + ' reviews">' + star + '<b>' + p.rate.toFixed(1) + '</b><small>(' + p.reviews + ')</small></p>' +
      '</div>';
  }

  function card(p, i) {
    var tag = p.tag ? '<i class="pc__tag">' + p.tag + '</i>' : '';
    var save = p.was ? '<i class="pc__save"><small>Save</small><b>' + money(p.was - p.price) + '</b></i>' : '';
    var tone = p.colors ? sw(p.colors[0]).hex : '#F5F5F5';
    return '<article class="pc" style="--i:' + i + ';--tone:' + tone + '">' +
      '<div class="pc__pic">' + tag + save +
        '<img class="pc__img" src="' + p.img + '.webp" alt="' + p.name + '" loading="lazy" decoding="async">' +
        '<img class="pc__frame" src="' + p.img + '-frame.webp" alt="" loading="lazy" decoding="async"></div>' +
      '<div class="pc__body">' + meta(p) +
        '<h3 class="pc__name">' + p.name + '</h3>' +
        '<p class="pc__line">' + p.line + '</p>' +
        '<ul class="pc__specs">' + p.specs.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' +
        '<div class="pc__row"><div class="pc__buy"><p class="pc__price"><em>' + money(p.price) + '</em>' + (p.was ? '<s>' + money(p.was) + '</s>' : '') + '</p>' +
          '<p class="pc__apr" title="' + d.apr.months + ' months at 0% APR with ' + d.apr.by + '">or <b>' + money(Math.ceil(p.price / d.apr.months)) + '/mo</b><span>· 0% APR with</span>' +
            '<img class="pc__affirm" src="' + d.apr.logo + '" alt="' + d.apr.by + '" width="420" height="167" loading="lazy" decoding="async"></p></div>' +
          '<button class="pc__add" type="button" data-add="' + p.id + '" aria-label="Add ' + p.name + ' to cart">' +
            ico.plus + ico.done + '<span>Add to cart</span></button></div>' +
      '</div></article>';
  }

  function list() {
    var out = d.items.filter(F.pass);
    var by = {
      low: function (a, b) { return a.price - b.price; },
      high: function (a, b) { return b.price - a.price; },
      range: function (a, b) { return b.range - a.range; }
    }[sort];
    return by ? out.slice().sort(by) : out;
  }

  function render() {
    var items = list();
    var on = F.active();
    grid.innerHTML = items.length ? items.map(card).join('') :
      '<p class="coll__empty">No bikes match these filters.<button class="hbtn hbtn--line" type="button" data-clear>Clear filters</button></p>';
    countEl.textContent = items.length + (items.length === 1 ? ' bike' : ' bikes');
    fbtn.querySelector('i').textContent = on.length || '';
    act.innerHTML = on.map(function (a) {
      return '<li><button class="coll__pill" type="button" data-g="' + a.g + '" data-v="' + a.v + '" aria-label="Remove ' + a.name + '">' + a.name + ico.x + '</button></li>';
    }).join('') + (on.length > 1 ? '<li><button class="coll__wipe" type="button" data-clear>Clear all</button></li>' : '');
    bar.classList.toggle('has-on', on.length > 0);
  }

  function jump() {
    var top = grid.getBoundingClientRect().top;
    if (top < 0 || top > innerHeight) document.getElementById('coll').scrollIntoView({ behavior: 'smooth' });
  }

  F.onChange(function (open) {
    if (typeof open === 'boolean') {
      fbtn.setAttribute('aria-expanded', String(open));
      if (!open) jump();
      return;
    }
    render();
    if (!document.getElementById('collFilter').classList.contains('is-on')) jump();
  });

  fbtn.addEventListener('click', F.open);
  sel.addEventListener('change', function () { sort = sel.value; render(); });
  act.addEventListener('click', function (e) {
    var b = e.target.closest('[data-g], [data-clear]');
    if (!b) return;
    if (b.dataset.g) F.toggle(b.dataset.g, b.dataset.v);
    else F.clear();
  });

  function pickColor(dot) {
    if (dot.classList.contains('is-on')) return;
    var pc = dot.closest('.pc'), name = pc.querySelector('.pc__cname > span'), pic = pc.querySelector('.pc__pic');
    pc.querySelectorAll('.pc__dot').forEach(function (x) {
      x.classList.toggle('is-on', x === dot);
      x.setAttribute('aria-checked', String(x === dot));
    });
    pc.style.setProperty('--tone', sw(dot.dataset.sw).hex);
    pic.classList.remove('is-swap');
    void pic.offsetWidth;
    pic.classList.add('is-swap');
    name.classList.add('is-out');
    clearTimeout(name._t);
    name._t = setTimeout(function () {
      name.textContent = sw(dot.dataset.sw).name;
      name.classList.replace('is-out', 'is-pre');
      void name.offsetWidth;
      name.classList.remove('is-pre');
    }, 180);
  }

  grid.addEventListener('click', function (e) {
    var dot = e.target.closest('.pc__dot');
    if (dot) return pickColor(dot);
    var b = e.target.closest('[data-add], [data-clear]');
    if (!b) return;
    if (!b.dataset.add) return F.clear();
    if (window.TeswayCart) window.TeswayCart.add(b.dataset.add);
    b.classList.add('is-done');
    b.querySelector('span').textContent = 'Added';
    clearTimeout(b._t);
    b._t = setTimeout(function () {
      b.classList.remove('is-done');
      b.querySelector('span').textContent = 'Add to cart';
    }, 1600);
  });

  var svc = document.getElementById('collSvc');
  if (svc) svc.innerHTML = d.perks.map(function (p, i) {
    return '<li class="csvc__item" style="--i:' + i + '"><span class="csvc__ico"><svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path class="ico-base" d="' + p.icon + '"/><path class="ico-draw" d="' + p.icon + '" pathLength="1"/></svg></span>' +
      '<span class="csvc__txt"><b>' + p.title + '</b><small>' + p.text + '</small></span></li>';
  }).join('');

  render();
})();
