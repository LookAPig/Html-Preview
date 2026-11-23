(function () {
  var data = window.TESWAY_MEGA;
  var tdata = window.TESWAY_TMEGA || {};
  var menu = document.getElementById('navMenu');
  if (!menu) return;

  var mobile = window.matchMedia('(max-aspect-ratio: 999/1000)');
  var body = document.body;
  var items = [];
  var onOpen = {};

  function toggle(t, open) {
    items.forEach(function (x) {
      var on = x === t && open;
      x.classList.toggle('is-open', on);
      x.setAttribute('aria-expanded', String(on));
    });
    if (t && open && onOpen[items.indexOf(t)]) requestAnimationFrame(onOpen[items.indexOf(t)]);
  }

  function accordion(trigger, html, cls) {
    var wrap = document.createElement('div');
    wrap.className = 'mnav' + (cls ? ' ' + cls : '');
    wrap.innerHTML = '<div class="mnav__inner"><div class="mnav__body">' + html + '</div></div>';
    trigger.insertAdjacentElement('afterend', wrap);
    trigger.setAttribute('aria-expanded', 'false');
    items.push(trigger);
    trigger.addEventListener('click', function (e) {
      if (!mobile.matches) return;
      e.preventDefault();
      toggle(trigger, !trigger.classList.contains('is-open'));
    });
    return wrap;
  }

  function more(d) {
    return '<a class="mnav__all" href="' + d.link.href + '">' + d.link.label + ' &#8594;</a>';
  }

  function textHtml(d) {
    return '<div class="mnav__groups">' + d.cols.map(function (c, i) {
      return '<div class="mnav__group" style="--d:' + (i * 0.05) + 's"><p class="mnav__eyebrow">' + c.title + '</p><ul>' +
        c.links.map(function (l) {
          return '<li><a class="mnav__link" href="' + l.href + '">' + l.name + '</a></li>';
        }).join('') + '</ul></div>';
    }).join('') + '</div>' + more(d);
  }

  function imgHtml(d) {
    return '<div class="mnav__tiles">' + d.tiles.map(function (t, i) {
      return '<a class="mnav__tile" href="' + t.href + '" style="--d:' + (i * 0.05) + 's">' +
        '<img src="' + t.img + '" alt="' + t.title + '" loading="lazy">' +
        '<span><i>' + t.tag + '</i><b>' + t.title + '</b></span></a>';
    }).join('') + '</div>' + more(d);
  }

  menu.querySelectorAll('[data-tmega]').forEach(function (t) {
    var d = tdata[t.dataset.tmega];
    if (d) accordion(t, d.tiles ? imgHtml(d) : textHtml(d), d.tiles ? 'is-img' : 'is-text');
  });

  var trigger = menu.querySelector('[data-mega]');
  if (data && trigger) {
    var card = function (p) {
      var tag = p.tag ? '<i class="mnav__tag">' + p.tag + '</i>' : '';
      var was = p.was ? '<s>' + p.was + '</s>' : '';
      return '<a class="mnav__card" href="' + p.href + '">' +
        '<span class="mnav__pic"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></span>' +
        '<span class="mnav__info"><b>' + p.name + tag + '</b>' +
        '<span class="mnav__price"><em>' + p.price + '</em>' + was + '</span></span></a>';
    };
    var tabs = data.groups.map(function (g, i) {
      return '<button class="mnav__tab" type="button" role="tab" data-i="' + i + '">' +
        g.name + '<i>' + g.products.length + '</i></button>';
    }).join('');
    var panels = data.groups.map(function (g, i) {
      return '<div class="mnav__panel" role="tabpanel" data-i="' + i + '">' +
        '<div class="mnav__track">' + g.products.map(card).join('') + '</div>' +
        '<a class="mnav__all" href="' + g.href + '">View all ' + g.name + ' &#8594;</a></div>';
    }).join('');
    var wrap = accordion(trigger, '<div class="mnav__tabs" role="tablist"><i class="mnav__pill"></i>' + tabs + '</div>' +
      '<div class="mnav__panels">' + panels + '</div>');

    var tabEls = wrap.querySelectorAll('.mnav__tab');
    var panelEls = wrap.querySelectorAll('.mnav__panel');
    var pill = wrap.querySelector('.mnav__pill');
    var index = -1;
    var movePill = function () {
      var t = tabEls[index];
      if (!t) return;
      pill.style.setProperty('--px', t.offsetLeft + 'px');
      pill.style.setProperty('--pw', t.offsetWidth + 'px');
    };
    var select = function (i) {
      if (i === index) return;
      index = i;
      tabEls.forEach(function (t, j) {
        t.classList.toggle('is-on', j === i);
        t.setAttribute('aria-selected', String(j === i));
      });
      panelEls.forEach(function (el, j) { el.classList.toggle('is-on', j === i); });
      movePill();
    };
    onOpen[items.indexOf(trigger)] = movePill;
    tabEls.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
    });
    window.addEventListener('resize', movePill);
    select(0);
  }

  var foot = document.createElement('div');
  foot.className = 'mnav-foot';
  foot.innerHTML = '<div class="mnav-foot__btns">' +
    '<a class="mnav-foot__btn" href="#">Sign in</a>' +
    '<a class="mnav-foot__btn is-solid" href="' + (data ? data.promo.href : '#top') + '">Shop the sale</a></div>' +
    '<p>Free shipping &amp; 2-year warranty on every TESWAY</p>';
  menu.appendChild(foot);
  Array.prototype.forEach.call(menu.children, function (el, i) {
    el.style.setProperty('--md', (0.05 + i * 0.025).toFixed(3) + 's');
  });

  new MutationObserver(function () {
    if (mobile.matches && !body.classList.contains('menu-open')) {
      setTimeout(function () {
        if (!body.classList.contains('menu-open')) toggle(null, false);
      }, 450);
    }
  }).observe(body, { attributes: true, attributeFilter: ['class'] });
  mobile.addEventListener('change', function () { if (mobile.matches) toggle(null, false); });
})();
