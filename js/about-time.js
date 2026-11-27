/* ==== about-time.js · year rail for the first-person ride (the ride itself lives in a3d/) ==== */
(function () {
  var rail = document.getElementById('timeRail');
  var srList = document.getElementById('timeList');
  var list = window.TESWAY_ABOUT && window.TESWAY_ABOUT.time;
  if (!rail || !list) return;
  var last = -2, lastU = -1;

  srList.innerHTML = list.map(function (t) { return '<li>' + t.year + ': ' + t.title + '. ' + t.text + '</li>'; }).join('');
  rail.innerHTML = '<li class="atime__fill" aria-hidden="true"><i></i></li>' + list.map(function (t, i) {
    return '<li><button type="button" data-i="' + i + '" aria-label="' + t.year + ' · ' + t.title + '"><i></i>' + t.year + '</button></li>';
  }).join('');
  var dots = Array.prototype.slice.call(rail.querySelectorAll('button'));
  var fill = rail.querySelector('.atime__fill i');

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
    }
  };

  rail.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    var stops = window.TeswayRideStops;
    if (b && window.TeswayStage && stops) window.TeswayStage.jump(stops[Number(b.dataset.i)]);
  });
})();
