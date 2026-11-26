/* ==== about-time.js · year rail for the first-person ride (the ride itself lives in a3d/) ==== */
(function () {
  var rail = document.getElementById('timeRail');
  var srList = document.getElementById('timeList');
  var list = window.TESWAY_ABOUT && window.TESWAY_ABOUT.time;
  if (!rail || !list) return;
  var n = list.length, last = -2;

  srList.innerHTML = list.map(function (t) { return '<li>' + t.year + ': ' + t.title + '. ' + t.text + '</li>'; }).join('');
  rail.innerHTML = '<li class="atime__fill" aria-hidden="true"><i></i></li>' + list.map(function (t, i) {
    return '<li><button type="button" data-i="' + i + '" aria-label="' + t.year + ' · ' + t.title + '"><i></i>' + t.year + '</button></li>';
  }).join('');
  var dots = Array.prototype.slice.call(rail.querySelectorAll('button'));
  var fill = rail.querySelector('.atime__fill i');

  window.TeswayTime = {
    update: function (u, on) {
      if (on === last) return;
      last = on;
      fill.style.transform = 'scaleX(' + Math.max(0, on / (n - 1)).toFixed(4) + ')';
      dots.forEach(function (b, i) {
        b.classList.toggle('is-past', i <= on);
        b.classList.toggle('is-on', i === on);
      });
    }
  };

  rail.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (b && window.TeswayStage) window.TeswayStage.story((Number(b.dataset.i) + 1.17) / (n + 1));
  });
})();
