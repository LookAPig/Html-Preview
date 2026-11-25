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

  function card(p, i) {
    var tag = p.tag ? '<i class="pc__tag">' + p.tag + '</i>' : '';
    var save = p.was ? '<i class="pc__save">Save ' + money(p.was - p.price) + '</i>' : '';
    return '<article class="pc" style="--i:' + i + '">' +
      '<div class="pc__pic">' + tag + save +
        '<img class="pc__img" src="' + p.img + '.webp" alt="' + p.name + '" loading="lazy" decoding="async">' +
        '<img class="pc__frame" src="' + p.img + '-frame.webp" alt="" loading="lazy" decoding="async"></div>' +
      '<div class="pc__body">' +
        '<h3 class="pc__name">' + p.name + '</h3>' +
        '<p class="pc__line">' + p.line + '</p>' +
        '<ul class="pc__specs">' + p.specs.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' +
        '<div class="pc__row"><p class="pc__price"><em>' + money(p.price) + '</em>' + (p.was ? '<s>' + money(p.was) + '</s>' : '') + '</p>' +
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

  grid.addEventListener('click', function (e) {
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
