(function () {
  var data = window.TESWAY_BLOG;
  var box = document.getElementById('blogBox');
  if (!data || !box) return;

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  var current = '';
  var swapT = 0;

  function author(p, lead) {
    var a = data.authors[p.cat];
    var ini = a.name.split(' ').map(function (w) { return w[0]; }).join('');
    return '<span class="bpost__by"><i class="bpost__ava bpost__ava--' + p.cat.toLowerCase() + '" aria-hidden="true">' + ini + '</i>' +
      '<span><b>' + a.name + '</b>' + (lead ? '<small>' + a.role + '</small>' : '') + '</span></span>';
  }

  function post(p, k, lead) {
    return '<a class="bpost' + (lead ? ' bpost--lead' : '') + '" href="#blog" style="--i:' + k + '">' +
      '<span class="bpost__img"><img src="' + p.img + '" alt="" loading="lazy" decoding="async"></span>' +
      '<span class="bpost__body">' +
        '<span class="bpost__meta"><b>' + p.cat + '</b><i></i>' + p.date + '<i></i>' + p.read + ' min read</span>' +
        '<strong class="bpost__title"><span>' + p.title + '</span></strong>' +
        (lead ? '<span class="bpost__text">' + p.text + '</span><span class="bpost__foot">' + author(p, true) +
          '<span class="bpost__more">Read story' + arrow + '</span></span>' : author(p, false)) +
      '</span></a>';
  }

  box.innerHTML =
    '<div class="blog__bar">' +
      '<div class="blog__cats" role="tablist" aria-label="Blog categories">' + data.cats.map(function (c) {
        return '<button class="blog__cat" type="button" role="tab" data-cat="' + c + '">' + c + '</button>';
      }).join('') + '</div>' +
      '<a class="hbtn hbtn--line blog__all" href="#blog">View all stories' + arrow + '</a>' +
    '</div>' +
    '<div class="blog__grid" aria-live="polite"></div>';

  var grid = box.querySelector('.blog__grid');
  var cats = Array.prototype.slice.call(box.querySelectorAll('.blog__cat'));

  function fill(cat) {
    var list = data.posts.filter(function (p) { return cat === 'All' || p.cat === cat; }).slice(0, 4);
    grid.innerHTML = post(list[0], 0, true) +
      '<div class="blog__list">' + list.slice(1).map(function (p, k) { return post(p, k + 1, false); }).join('') + '</div>';
  }

  function set(cat) {
    if (cat === current) return;
    var first = !current;
    current = cat;
    cats.forEach(function (b) {
      var on = b.dataset.cat === cat;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on);
    });
    clearTimeout(swapT);
    if (first || calm.matches) { fill(cat); return; }
    grid.classList.add('is-out');
    swapT = setTimeout(function () {
      fill(cat);
      grid.classList.remove('is-out');
    }, 280);
  }

  cats.forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.cat); }); });
  set(data.cats[0]);
})();
