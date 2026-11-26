/* ==== about-voice.js · rider reviews carousel ==== */
(function () {
  var listEl = document.getElementById('voiceList');
  var ctrl = document.getElementById('voiceCtrl');
  var scoreEl = document.getElementById('voiceScore');
  var data = window.TESWAY_ABOUT && window.TESWAY_ABOUT.voice;
  if (!listEl || !ctrl || !data) return;

  var STAR = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.2l2 4.3 4.7.5-3.5 3.2 1 4.6L8 11.5l-4.2 2.3 1-4.6L1.3 6l4.7-.5z"/></svg>';
  var stars = '<span class="abv__stars" aria-label="5 out of 5 stars">' + new Array(6).join(STAR) + '</span>';
  function pad(n) { return String(n).padStart(2, '0'); }
  function initials(name) { return name.split(' ').map(function (w) { return w[0]; }).join(''); }

  if (scoreEl) {
    scoreEl.innerHTML = '<b>' + data.score.toFixed(1) + '</b>' +
      '<span>' + stars + '<small>' + data.count + ' reviews on ' + data.sources.join(' · ') + '</small></span>';
  }

  listEl.innerHTML = '<div class="abv__track" id="voiceTrack">' + data.reviews.map(function (r) {
    return '<article class="abv__card">' + stars +
      '<h3>' + r.title + '</h3><p>' + r.text + '</p>' +
      '<footer class="abv__who"><i aria-hidden="true">' + initials(r.name) + '</i>' +
      '<span><b>' + r.name + '</b><small>' + r.from + '</small></span><em>' + r.bike + '</em></footer></article>';
  }).join('') + '</div>';

  ctrl.innerHTML = '<b class="cr__now">01</b><span class="cr__bar"><i></i></span><small class="cr__total">01</small>' +
    '<div class="hero__arrows cr__arrows">' +
    '<button class="arw" type="button" data-dir="-1" aria-label="Previous reviews"><span>&#8592;</span></button>' +
    '<button class="arw" type="button" data-dir="1" aria-label="Next reviews"><span>&#8594;</span></button></div>';

  var track = document.getElementById('voiceTrack');
  var cards = track.children;
  var now = ctrl.querySelector('.cr__now');
  var total = ctrl.querySelector('.cr__total');
  var bar = ctrl.querySelector('.cr__bar i');
  var arrows = ctrl.querySelectorAll('.cr__arrows button');
  var ticking = false;

  function step() { return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth; }

  function update() {
    ticking = false;
    var n = cards.length;
    var max = track.scrollWidth - track.clientWidth;
    var p = max > 0 ? track.scrollLeft / max : 1;
    var visible = max > 0 ? Math.round(track.clientWidth / step()) : n;
    var first = Math.round(track.scrollLeft / step());
    var i = p > 0.995 ? n : Math.min(n, first + visible);
    bar.style.transform = 'scaleX(' + Math.max(0.04, i / n) + ')';
    now.textContent = pad(i);
    total.textContent = pad(n);
    arrows[0].disabled = track.scrollLeft < 4;
    arrows[1].disabled = track.scrollLeft > max - 4;
  }

  track.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener('resize', update);
  arrows.forEach(function (b) {
    b.addEventListener('click', function () { track.scrollBy({ left: step() * Number(b.dataset.dir), behavior: 'smooth' }); });
  });
  update();
})();
