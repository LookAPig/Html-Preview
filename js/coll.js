(function () {
  var d = window.TESWAY_COLL;
  var bar = document.getElementById('collBar');
  var grid = document.getElementById('collGrid');
  if (!d || !bar || !grid) return;

  var svg = function (p) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + p + '"/></svg>';
  };
  var ico = { plus: svg('M12 6v12M6 12h12'), done: svg('M6 12.5l4 4 8-9') };
  var money = function (n) { return '$' + n.toLocaleString('en-US'); };
  var ids = d.cats.map(function (c) { return c.id; });
  var q = new URLSearchParams(location.search).get('c');
  var state = { cat: ids.indexOf(q) > -1 ? q : 'all', sort: 'featured' };

  function count(id) {
    return id === 'all' ? d.items.length : d.items.filter(function (p) { return p.cat === id; }).length;
  }

  bar.innerHTML =
    '<div class="coll__chips" role="tablist" aria-label="Filter bikes">' + d.cats.map(function (c) {
      return '<button class="coll__chip" type="button" role="tab" data-cat="' + c.id + '">' + c.name + '<i>' + count(c.id) + '</i></button>';
    }).join('') + '</div>' +
    '<div class="coll__tools"><p class="coll__count" aria-live="polite"></p>' +
      '<label class="coll__sort"><span>Sort</span><select>' + d.sorts.map(function (s) {
        return '<option value="' + s.id + '">' + s.name + '</option>';
      }).join('') + '</select></label></div>';

  var chips = bar.querySelectorAll('.coll__chip');
  var sel = bar.querySelector('select');
  var countEl = bar.querySelector('.coll__count');

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
    var out = d.items.filter(function (p) { return state.cat === 'all' || p.cat === state.cat; });
    var by = {
      low: function (a, b) { return a.price - b.price; },
      high: function (a, b) { return b.price - a.price; },
      range: function (a, b) { return b.range - a.range; }
    }[state.sort];
    return by ? out.slice().sort(by) : out;
  }

  function render() {
    var items = list();
    grid.innerHTML = items.length ? items.map(card).join('') :
      '<p class="coll__empty">No bikes here yet. <button type="button" data-cat="all">See all bikes</button></p>';
    countEl.textContent = items.length + (items.length === 1 ? ' bike' : ' bikes');
    chips.forEach(function (c) {
      var on = c.dataset.cat === state.cat;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-selected', String(on));
    });
  }

  function setCat(id) {
    if (id === state.cat) return;
    state.cat = id;
    var url = id === 'all' ? location.pathname : '?c=' + id;
    history.replaceState(null, '', url + location.hash);
    render();
  }

  bar.addEventListener('click', function (e) {
    var c = e.target.closest('[data-cat]');
    if (!c) return;
    setCat(c.dataset.cat);
    c.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  });
  sel.addEventListener('change', function () { state.sort = sel.value; render(); });

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add], [data-cat]');
    if (!b) return;
    if (b.dataset.cat) return setCat(b.dataset.cat);
    if (window.TeswayCart) window.TeswayCart.add(b.dataset.add);
    b.classList.add('is-done');
    b.querySelector('span').textContent = 'Added';
    clearTimeout(b._t);
    b._t = setTimeout(function () {
      b.classList.remove('is-done');
      b.querySelector('span').textContent = 'Add to cart';
    }, 1600);
  });

  var perks = document.getElementById('collPerks');
  if (perks) perks.innerHTML = d.perks.map(function (p) {
    return '<li class="cperk__item"><span class="cperk__ico">' + svg(p.icon) + '</span><b>' + p.title + '</b><small>' + p.text + '</small></li>';
  }).join('');

  render();
})();
