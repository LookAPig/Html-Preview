(function () {
  var data = window.TESWAY_TMEGA;
  var nav = document.getElementById('nav');
  if (!data || !nav) return;
  var triggers = Array.prototype.filter.call(
    document.querySelectorAll('#navMenu [data-tmega]'),
    function (t) { return data[t.dataset.tmega]; }
  );
  if (!triggers.length) return;

  var desktop = window.matchMedia('(min-aspect-ratio: 1/1) and (hover: hover)');
  var body = document.body;

  function link(l) {
    var desc = l.desc ? '<small>' + l.desc + '</small>' : '';
    return '<li><a class="tmega__link" href="' + l.href + '"><b>' + l.name + '</b>' + desc + '</a></li>';
  }

  function col(c, i) {
    return '<div class="tmega__col" style="--d:' + (0.16 + i * 0.06) + 's">' +
      '<p class="tmega__eyebrow">' + c.title + '</p><ul>' + c.links.map(link).join('') + '</ul></div>';
  }

  function tile(t, i) {
    return '<a class="tmega__tile" href="' + t.href + '" style="--t:' + (0.16 + i * 0.05) + 's">' +
      '<img src="' + t.img + '" alt="' + t.title + '" loading="lazy">' +
      '<span class="tmega__cap"><i>' + t.tag + '</i><b>' + t.title + '</b></span></a>';
  }

  function panel(key) {
    var d = data[key];
    var body = d.tiles
      ? '<div class="tmega__tiles">' + d.tiles.map(tile).join('') + '</div>'
      : d.cols.map(col).join('');
    var p = d.promo;
    var side = p ? '<aside class="mega__side tmega__side"><a class="mega__promo" href="' + p.href + '">' +
      '<img src="' + p.img + '" alt="" loading="lazy"><span class="mega__promo-copy"><i>' + p.tag + '</i>' +
      '<b>' + p.title + '</b><em>' + p.link + ' &#8594;</em></span></a></aside>' : '';
    var cls = d.tiles ? ' is-img' : p ? ' has-promo' : '';
    var cols = d.cols ? ' style="--cols:' + d.cols.length + '"' : '';
    return '<div class="tmega__panel' + cls + '" data-key="' + key + '"' + cols + '>' +
      '<div class="tmega__intro"><p class="tmega__eyebrow">' + d.eyebrow + '</p>' +
      '<h3>' + d.title + '</h3><p>' + d.text + '</p>' +
      '<a class="tmega__more" href="' + d.link.href + '">' + d.link.label + ' &#8594;</a></div>' +
      body + side + '</div>';
  }

  var box = document.createElement('div');
  box.className = 'tmega';
  box.id = 'tmega';
  box.setAttribute('role', 'region');
  box.innerHTML = '<div class="tmega__inner">' +
    triggers.map(function (t) { return panel(t.dataset.tmega); }).join('') + '</div>';
  nav.appendChild(box);

  triggers.forEach(function (t) {
    t.setAttribute('aria-haspopup', 'true');
    t.setAttribute('aria-expanded', 'false');
    t.setAttribute('aria-controls', 'tmega');
    t.insertAdjacentHTML('beforeend',
      '<svg class="nav__caret" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5"/></svg>');
  });

  var panels = box.querySelectorAll('.tmega__panel');
  var timer = null, isOpen = false;

  function show(key) {
    panels.forEach(function (p) { p.classList.toggle('is-on', p.dataset.key === key); });
    triggers.forEach(function (t) {
      var on = t.dataset.tmega === key;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-expanded', String(on));
    });
    box.setAttribute('aria-label', data[key].eyebrow);
  }

  function open(key) {
    clearTimeout(timer);
    if (!desktop.matches) return;
    if (!isOpen) {
      var swap = body.classList.contains('mega-open');
      document.dispatchEvent(new Event('tmega:open'));
      if (swap) {
        box.classList.add('is-instant');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { box.classList.remove('is-instant'); });
        });
      }
      isOpen = true;
      body.classList.add('tmega-open');
      nav.classList.add('is-tmega');
    }
    show(key);
  }

  function close() {
    clearTimeout(timer);
    if (!isOpen) return;
    isOpen = false;
    body.classList.remove('tmega-open');
    nav.classList.remove('is-tmega');
    triggers.forEach(function (t) {
      t.classList.remove('is-active');
      t.setAttribute('aria-expanded', 'false');
    });
  }

  function later() {
    clearTimeout(timer);
    timer = setTimeout(close, 180);
  }

  triggers.forEach(function (t) {
    var key = t.dataset.tmega;
    t.addEventListener('mouseenter', function () { open(key); });
    t.addEventListener('focus', function () { open(key); });
    t.addEventListener('mouseleave', later);
    t.addEventListener('click', close);
  });
  box.addEventListener('mouseenter', function () { clearTimeout(timer); });
  box.addEventListener('mouseleave', later);
  box.addEventListener('focusout', function (e) {
    if (!nav.contains(e.relatedTarget)) later();
  });
  box.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });

  var scrim = document.querySelector('.mega-scrim');
  if (scrim) scrim.addEventListener('click', close);
  document.addEventListener('mega:open', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  window.addEventListener('scroll', function () { if (isOpen) later(); }, { passive: true });
  desktop.addEventListener('change', close);
})();
