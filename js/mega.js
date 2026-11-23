(function () {
  var data = window.TESWAY_MEGA;
  var nav = document.getElementById('nav');
  var trigger = document.querySelector('#navMenu [data-mega]');
  if (!data || !nav || !trigger) return;

  var desktop = window.matchMedia('(min-aspect-ratio: 1/1) and (hover: hover)');
  var body = document.body;

  function cats() {
    return data.groups.map(function (g, i) {
      return '<li><button class="mega__cat" type="button" data-i="' + i + '">' +
        '<b>' + g.name + '</b><small>' + g.desc + '</small>' +
        '<span class="mega__num">' + g.products.length + '</span></button></li>';
    }).join('');
  }

  function card(p) {
    var tag = p.tag ? '<i class="mega__tag">' + p.tag + '</i>' : '';
    var was = p.was ? '<s>' + p.was + '</s>' : '';
    return '<a class="mega__card" href="' + p.href + '">' +
      '<span class="mega__pic">' + tag + '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></span>' +
      '<b class="mega__name">' + p.name + '</b>' +
      '<span class="mega__price"><em>' + p.price + '</em>' + was + '</span>' +
    '</a>';
  }

  function panels() {
    return data.groups.map(function (g, i) {
      return '<div class="mega__panel" data-i="' + i + '" style="--n:' + g.products.length + '">' +
        '<div class="mega__grid">' + g.products.map(card).join('') + '</div>' +
        '<a class="mega__all" href="' + g.href + '">View all ' + g.name + ' &#8594;</a>' +
      '</div>';
    }).join('');
  }

  function promo() {
    var p = data.promo;
    return '<a class="mega__promo" href="' + p.href + '"><img src="' + p.img + '" alt="" loading="lazy">' +
      '<span class="mega__promo-copy"><i>' + p.tag + '</i><b>' + p.title + '</b><em>' + p.link + ' &#8594;</em></span></a>';
  }

  var mega = document.createElement('div');
  mega.className = 'mega';
  mega.id = 'mega';
  mega.setAttribute('role', 'region');
  mega.setAttribute('aria-label', 'Shop bikes');
  mega.innerHTML = '<div class="mega__inner">' +
    '<div class="mega__cats"><p class="mega__eyebrow">' + data.eyebrow + '</p><ul>' + cats() + '</ul><i class="mega__bar"></i></div>' +
    '<div class="mega__show">' + panels() + '</div>' +
    '<aside class="mega__side">' + promo() + '</aside>' +
  '</div>';
  nav.appendChild(mega);

  var scrim = document.createElement('div');
  scrim.className = 'mega-scrim';
  body.appendChild(scrim);

  trigger.setAttribute('aria-controls', 'mega');
  trigger.insertAdjacentHTML('beforeend',
    '<svg class="nav__caret" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5"/></svg>');

  var catEls = mega.querySelectorAll('.mega__cat');
  var panelEls = mega.querySelectorAll('.mega__panel');
  var bar = mega.querySelector('.mega__bar');
  var index = -1, timer = null, isOpen = false, quiet = false;

  function select(i) {
    if (i === index) return;
    [catEls, panelEls].forEach(function (list) {
      list.forEach(function (el, j) { el.classList.toggle('is-on', j === i); });
    });
    index = i;
    var c = catEls[i];
    bar.style.setProperty('--by', c.offsetTop + 'px');
    bar.style.setProperty('--bh', c.offsetHeight + 'px');
  }

  function open() {
    clearTimeout(timer);
    if (isOpen || !desktop.matches) return;
    if (body.classList.contains('tmega-open')) {
      mega.classList.add('is-instant');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { mega.classList.remove('is-instant'); });
      });
    }
    document.dispatchEvent(new Event('mega:open'));
    isOpen = true;
    body.classList.add('mega-open');
    nav.classList.add('is-mega');
    trigger.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(function () {
      var i = index < 0 ? 0 : index;
      index = -1;
      select(i);
    });
  }

  function close() {
    clearTimeout(timer);
    if (!isOpen) return;
    isOpen = false;
    body.classList.remove('mega-open');
    nav.classList.remove('is-mega');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function later() {
    clearTimeout(timer);
    timer = setTimeout(close, 180);
  }

  trigger.addEventListener('mouseenter', open);
  trigger.addEventListener('mouseleave', later);
  trigger.addEventListener('focus', function () { if (!quiet) open(); });
  trigger.addEventListener('click', function (e) {
    if (!desktop.matches) return;
    e.preventDefault();
    if (isOpen) close();
    else open();
  });
  mega.addEventListener('mouseenter', function () { clearTimeout(timer); });
  mega.addEventListener('mouseleave', later);
  mega.addEventListener('focusout', function (e) {
    if (!nav.contains(e.relatedTarget)) later();
  });
  catEls.forEach(function (c, i) {
    c.addEventListener('mouseenter', function () { select(i); });
    c.addEventListener('focus', function () { select(i); });
    c.addEventListener('click', function () { select(i); });
  });
  mega.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) {
      close();
      quiet = true;
      trigger.focus({ preventScroll: true });
      quiet = false;
    }
  });
  window.addEventListener('scroll', function () { if (isOpen) later(); }, { passive: true });
  document.addEventListener('tmega:open', close);
  desktop.addEventListener('change', close);
})();
