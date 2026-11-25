(function () {
  var data = window.TESWAY_GUIDES;
  var list = document.getElementById('guideList');
  if (!data || !list) return;

  var bikes = {};
  ((window.TESWAY_COLL || {}).items || []).forEach(function (b) { bikes[b.id] = b; });
  var arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  function money(n) { return '$' + n.toLocaleString('en-US'); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function pair(id) {
    var b = bikes[id];
    if (!b) return '';
    return '<a class="gd__pair" href="#coll" aria-label="Shop ' + b.name + '">' +
      '<span class="gd__thumb"><img src="' + b.img + '.webp" alt="" loading="lazy" decoding="async"></span>' +
      '<span class="gd__pname"><small>Pairs with</small><b>' + b.name + '</b><em>' + money(b.price) + '</em></span>' +
      '<i class="gd__go">' + arrow + arrow + '</i></a>';
  }

  function card(p, k) {
    return '<article class="gd" style="--i:' + k + '">' +
      '<div class="gd__pic"><img src="' + p.img + '" alt="" loading="lazy" decoding="async">' +
        '<i class="gd__cat">' + p.cat + '</i></div>' +
      '<div class="gd__body">' +
        '<p class="gd__meta"><b>' + pad(k + 1) + '</b><span>' + p.read + ' min read</span><i></i><span>' + p.date + '</span></p>' +
        '<h3 class="gd__title"><a href="' + data.all.href + '"><span>' + p.title + '</span></a></h3>' +
        '<p class="gd__text">' + p.text + '</p>' +
        pair(p.bike) +
      '</div></article>';
  }

  list.innerHTML = data.posts.map(card).join('');

  var ctrl = document.getElementById('guideCtrl');
  if (ctrl) {
    ctrl.innerHTML = '<b class="cr__now">01</b><span class="cr__bar"><i></i></span><small class="cr__total">01</small>' +
      '<div class="hero__arrows cr__arrows">' +
        '<button class="arw" type="button" data-dir="-1" aria-label="Previous guides"><span>&#8592;</span></button>' +
        '<button class="arw" type="button" data-dir="1" aria-label="Next guides"><span>&#8594;</span></button>' +
      '</div>';
    var now = ctrl.querySelector('.cr__now');
    var total = ctrl.querySelector('.cr__total');
    var bar = ctrl.querySelector('.cr__bar i');
    var arrows = ctrl.querySelectorAll('.arw');
    var ticking = false;

    var step = function () {
      var c = list.children;
      return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : list.clientWidth;
    };
    var update = function () {
      ticking = false;
      var n = list.children.length;
      var max = list.scrollWidth - list.clientWidth;
      var at = Math.round(list.scrollLeft / step());
      var seen = max > 4 ? Math.max(1, Math.round(list.clientWidth / step())) : n;
      var i = list.scrollLeft > max - 4 ? n : Math.min(n, at + seen);
      bar.style.transform = 'scaleX(' + Math.max(0.04, i / n) + ')';
      now.textContent = pad(i);
      total.textContent = pad(n);
      arrows[0].disabled = list.scrollLeft < 4;
      arrows[1].disabled = list.scrollLeft > max - 4;
    };

    list.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    arrows.forEach(function (b) {
      b.addEventListener('click', function () {
        list.scrollBy({ left: step() * Number(b.dataset.dir), behavior: 'smooth' });
      });
    });
    update();
  }

  if (!('IntersectionObserver' in window)) { list.classList.add('is-in'); return; }
  var io = new IntersectionObserver(function (es) {
    if (!es[0].isIntersecting) return;
    list.classList.add('is-in');
    io.disconnect();
  }, { threshold: 0.15 });
  io.observe(list);
})();
