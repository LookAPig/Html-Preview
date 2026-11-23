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
