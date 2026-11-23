(function () {
  var MOBILE = '(max-aspect-ratio: 999/1000)';

  function media(s) {
    var html = '<div class="hs__media" style="--pos:' + s.pos + ';--posM:' + s.posM + '"><picture>';
    if (s.imgM) html += '<source media="' + MOBILE + '" srcset="' + s.imgM + '">';
    html += '<img src="' + s.img + '" alt=""></picture>';
    if (s.video) html += '<video data-src="' + s.video + '" muted loop playsinline preload="none"></video>';
    return html + '</div>';
  }

  function price(p) {
    if (!p) return '';
    var html = '<div class="hs__price"><b>' + p.now + '</b>';
    if (p.was) html += '<s>' + p.was + '</s>';
    if (p.save) html += '<i>' + p.save + '</i>';
    return html + '</div>';
  }

  function copy(s, i) {
    var tag = i === 0 ? 'h1' : 'h2';
    var meta = s.countdown
      ? s.countdown + ' · <b data-left>--</b> left'
      : s.meta;
    return '<div class="hs__copy">' +
      '<p class="hs__badge">' + s.badge + '</p>' +
      '<' + tag + ' class="hs__title"><span>' + s.title + '</span><em>' + s.accent + '</em></' + tag + '>' +
      '<p class="hs__desc">' + s.text + '</p>' +
      price(s.price) +
      '<div class="hs__cta">' +
        '<a class="hbtn" href="' + s.cta[0].href + '">' + s.cta[0].text + '</a>' +
        '<a class="hbtn hbtn--line" href="' + s.cta[1].href + '">' + s.cta[1].text + '</a>' +
      '</div>' +
      '<p class="hs__meta">' + meta + '</p>' +
    '</div>';
  }

  function ctrl(n) {
    var dots = '';
    for (var i = 0; i < n; i++) {
      dots += '<button type="button" aria-label="Go to slide ' + (i + 1) + '"></button>';
    }
    return '<div class="hero__dots">' + dots + '</div>' +
      '<p class="hero__count"><b>01</b> / ' + String(n).padStart(2, '0') + '</p>' +
      '<div class="hero__arrows">' +
        '<button class="arw" type="button" data-dir="-1" aria-label="Previous slide"><span>&#8592;</span></button>' +
        '<button class="arw" type="button" data-dir="1" aria-label="Next slide"><span>&#8594;</span></button>' +
      '</div>';
  }

  window.TeswayHeroBuild = function (root, bar, slides) {
    root.innerHTML = slides.map(function (s, i) {
      return '<article class="hs" role="group" aria-roledescription="slide" aria-label="' +
        (i + 1) + ' of ' + slides.length + '">' + media(s) + copy(s, i) + '</article>';
    }).join('');
    bar.innerHTML = ctrl(slides.length);
  };
})();
