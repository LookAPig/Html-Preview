/* ==== launch-rail.js · horizontal feature rail + full-bleed zoom reveal ==== */
(function () {
  var K = window.TeswayPDP, L = window.TESWAY_LAUNCH, S = window.TeswayScrub;
  var track = document.getElementById('lrlTrack'), zoom = document.getElementById('lzmBox');
  if (!K || !L || !S || !track) return;
  var D = K.D, x = K.x, shots = K.shots;
  var sec = track.closest('.lrl');
  var arrow = K.svg('M5 12h14M13 6l6 6-6 6', 2);

  track.innerHTML =
    '<header class="lrl__intro"><p class="eyebrow">' + L.rail.eyebrow + '</p><h2>' + L.rail.title + '</h2>' +
      '<p class="lrl__hint"><i></i>Keep scrolling</p></header>' +
    x.feats.map(function (k, i) {
      var f = D.feats[k], s = shots[(i + 1) % shots.length];
      return '<article class="lrl__card"><div class="lrl__pic"><img src="' + s.src + '" alt="' + s.alt + '" loading="lazy" decoding="async"></div>' +
        '<p class="lrl__no">0' + (i + 1) + '</p><h3>' + f[0] + '</h3><p>' + f[1] + '</p></article>';
    }).join('') +
    '<a class="lrl__card lrl__cta" href="#offer"><span>' + L.rail.cta + '</span>' + arrow + '</a>';

  function measure() {
    var shift = Math.max(0, track.scrollWidth - innerWidth);
    sec.style.setProperty('--shift', shift);
    sec.style.height = (shift + S.vh() * 1.2) + 'px';
  }
  S.resize(measure);
  measure();

  if (!zoom) return;
  var z = L.zoom;
  zoom.innerHTML =
    '<picture class="lzm__pic"><source media="(max-aspect-ratio: 999/1000)" srcset="' + z.img + '-m.jpg">' +
      '<img src="' + z.img + '.jpg" alt="Riding the ' + K.p.name + ' above the clouds" loading="lazy" decoding="async"></picture>' +
    '<h2 class="lzm__words">' + z.words.map(function (w, i) { return '<span style="--i:' + i + '">' + w + '</span>'; }).join('') + '</h2>' +
    '<p class="lzm__text">' + z.text + '</p>';
})();
