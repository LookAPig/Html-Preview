/* ==== launch-lens.js · pinned camera that pans and zooms onto each part of the bike ==== */
(function () {
  var K = window.TeswayPDP, L = window.TESWAY_LAUNCH, S = window.TeswayScrub;
  var box = document.getElementById('llsBox');
  if (!K || !L || !S || !box) return;
  var sec = box.parentNode, p = K.p, x = K.x, pts = L.lens, n = pts.length;
  var pad = function (i) { return (i < 9 ? '0' : '') + (i + 1); };
  sec.style.setProperty('--n', n);

  box.innerHTML =
    '<div class="lls__cam">' +
      '<img class="lls__img" src="' + p.img + '.webp" alt="' + p.name + '" width="1152" height="864" loading="lazy" decoding="async">' +
      '<img class="lls__xray" src="' + p.img + '-frame.webp" alt="" width="1152" height="864" loading="lazy" decoding="async">' +
      pts.map(function (s, i) {
        return i ? '<i class="lls__dot" data-i="' + i + '" style="left:' + s.at[0] + '%;top:' + s.at[1] + '%"></i>' : '';
      }).join('') +
    '</div>' +
    '<div class="lls__card" aria-live="polite"><p class="lls__no"><b>01</b> / ' + pad(n - 1) + '</p>' +
      '<div class="lls__body"></div><ol class="lls__steps">' + pts.map(function () { return '<li></li>'; }).join('') + '</ol></div>';

  var cam = box.querySelector('.lls__cam'), body = box.querySelector('.lls__body');
  var no = box.querySelector('.lls__no b'), steps = box.querySelectorAll('.lls__steps li');
  var dots = box.querySelectorAll('.lls__dot');
  var geo = {}, cur = -1, wide = false, last = 0;

  function measure() {
    wide = matchMedia('(min-aspect-ratio: 1/1)').matches;
    geo = { l: cam.offsetLeft, t: cam.offsetTop, w: cam.offsetWidth, h: cam.offsetHeight, W: box.offsetWidth, H: box.offsetHeight };
    render(last);
  }
  function card(i) {
    var s = pts[i];
    body.innerHTML = '<p class="lls__spec">' + (s.key ? x[s.key] : s.eyebrow) + '</p><h2>' + s.title + '</h2><p>' + s.text + '</p>';
    body.classList.remove('is-swap');
    void body.offsetWidth;
    body.classList.add('is-swap');
    no.textContent = pad(i);
    steps.forEach(function (li, k) { li.classList.toggle('is-on', k <= i); });
    dots.forEach(function (d) { d.classList.toggle('is-on', +d.dataset.i === i); });
  }
  function render(pr) {
    last = pr;
    var f = pr * (n - 1), i = Math.min(n - 2, Math.floor(f)), t = f - i;
    var k = Math.min(1, Math.max(0, (t - 0.2) / 0.6));
    k = k * k * (3 - 2 * k);
    var a = pts[i], b = pts[i + 1];
    var fx = (a.at[0] + (b.at[0] - a.at[0]) * k) / 100;
    var fy = (a.at[1] + (b.at[1] - a.at[1]) * k) / 100;
    var z = (a.z + (b.z - a.z) * k) * (1 - 0.18 * Math.sin(Math.PI * k));
    var w = Math.min(1, Math.max(0, (z - 1) / 0.8));
    var tx = geo.l + fx * geo.w + ((wide ? 0.36 : 0.5) * geo.W - geo.l - fx * geo.w) * w;
    var ty = geo.t + fy * geo.h + ((wide ? 0.5 : 0.32) * geo.H - geo.t - fy * geo.h) * w;
    cam.style.transform = 'translate(' + (tx - geo.l - fx * geo.w * z).toFixed(1) + 'px,' + (ty - geo.t - fy * geo.h * z).toFixed(1) + 'px) scale(' + z.toFixed(3) + ')';
    cam.style.setProperty('--s', z.toFixed(3));
    box.style.setProperty('--x', Math.min(1, f * 1.5).toFixed(3));
    var on = Math.round(f);
    if (on !== cur) { cur = on; card(on); }
  }

  S.resize(measure);
  S.on(sec, render);
  measure();
})();
