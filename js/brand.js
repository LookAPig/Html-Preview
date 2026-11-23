(function () {
  var box = document.getElementById('brandBox');
  var data = window.TESWAY_BRAND;
  var hero = window.TESWAY_BRAND_HERO;
  if (!box || !data || !hero) return;

  function svg(paths) {
    var draw = paths.replace(/<(path|circle|rect)/g, '<$1 pathLength="1"');
    return '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<g class="ico-base">' + paths + '</g><g class="ico-draw">' + draw + '</g></svg>';
  }

  function tile(t, i) {
    var ico = '<i class="btile__ico btile__ico--' + t.fx + '">' + svg(t.icon) + '</i>';
    var head = t.big ? ico + '<strong class="btile__big">' + t.big + '</strong>' : ico + '<h3 class="btile__title">' + t.title + '</h3>';
    return '<article class="btile reveal" data-delay="' + (i + 1) + '">' +
      '<img class="btile__img" src="' + t.img + '" alt="" loading="lazy" decoding="async">' +
      '<div class="btile__body">' + head + '<p class="btile__sub">' + t.sub + '</p></div></article>';
  }

  box.innerHTML = hero.html(data.hero, svg) + data.tiles.map(tile).join('');
  hero.init(box.firstChild);
})();
