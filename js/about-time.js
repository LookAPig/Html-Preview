/* ==== about-time.js · year rail + milestone card synced to the panel the rider is passing (the ride lives in a3d/) ==== */
(function () {
  var rail = document.getElementById('timeRail');
  var srList = document.getElementById('timeList');
  var card = document.getElementById('timeCard');
  var list = window.TESWAY_ABOUT && window.TESWAY_ABOUT.time;
  if (!rail || !list) return;
  var last = -2, lastU = -1, swap = 0;
  function pad(n) { return String(n).padStart(2, '0'); }

  srList.innerHTML = list.map(function (t) { return '<li>' + t.year + ': ' + t.title + '. ' + t.text + '</li>'; }).join('');
  rail.innerHTML = '<li class="atime__fill" aria-hidden="true"><i></i></li>' + list.map(function (t, i) {
    return '<li><button type="button" data-i="' + i + '" aria-label="' + t.year + ' · ' + t.title + '"><i></i>' + t.year + '</button></li>';
  }).join('');
  var dots = Array.prototype.slice.call(rail.querySelectorAll('button'));
  var fill = rail.querySelector('.atime__fill i');

  /* preload so a card never swaps in with an empty picture */
  list.forEach(function (t) { var im = new Image(); im.src = t.img; });

  function fillCard(i) {
    var t = list[i];
    card.innerHTML = '<div class="atime__pic"><img src="' + t.img + '" alt="" decoding="async"></div>' +
      '<div class="atime__body"><p class="atime__meta"><b>' + t.year + '</b><span>' + pad(i + 1) + ' / ' + pad(list.length) + '</span></p>' +
      '<h3>' + t.title + '</h3><p class="atime__text">' + t.text + '</p></div>';
  }

  function showCard(i) {
    if (!card) return;
    clearTimeout(swap);
    if (!card.innerHTML) { fillCard(i); card.classList.add('is-in'); return; }
    card.classList.remove('is-in');
    swap = setTimeout(function () { fillCard(i); card.classList.add('is-in'); }, 220);
  }

  window.TeswayTime = {
    update: function (u, on) {
      u = Math.max(0, Math.min(1, u));
      if (Math.abs(u - lastU) > 0.0005) { lastU = u; fill.style.transform = 'scaleX(' + u.toFixed(4) + ')'; }
      if (on === last) return;
      last = on;
      dots.forEach(function (b, i) {
        b.classList.toggle('is-past', i <= on);
        b.classList.toggle('is-on', i === on);
      });
      showCard(Math.max(0, on));
    }
  };

  rail.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    var stops = window.TeswayRideStops;
    if (b && window.TeswayStage && stops) window.TeswayStage.jump(stops[Number(b.dataset.i)]);
  });
})();
