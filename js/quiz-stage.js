(function () {
  var data = window.TESWAY_QUIZ;
  var mount = document.getElementById('quizMount');
  if (!data || !mount || !data.questions.length) return;

  var b = data.banner, qs = data.questions, n = qs.length;
  var HOLD = 4200;
  var arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  var back = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4"/></svg>';

  var pics = [];
  qs.forEach(function (q, i) {
    var src = q.img || b.scenes[i % b.scenes.length];
    if (pics.indexOf(src) < 0) pics.push(src);
  });
  function picOf(i) { return pics.indexOf(qs[i].img || b.scenes[i % b.scenes.length]); }
  function pad(v) { return String(v).padStart(2, '0'); }
  function optsHtml(q) {
    return q.options.map(function (o) {
      return '<button class="quiz__opt" type="button" aria-haspopup="dialog"><b>' + o.label + '</b><small>' + o.hint + '</small></button>';
    }).join('');
  }

  var scene = document.createElement('div');
  scene.className = 'quiz__scene';
  scene.setAttribute('aria-hidden', 'true');
  scene.innerHTML = pics.map(function (src, i) {
    return '<img class="quiz__img' + (i === picOf(0) ? ' is-on' : '') + '" src="' + src + '" alt="" loading="lazy" decoding="async">';
  }).join('');

  var segs = '';
  for (var k = 0; k < n; k++) segs += '<i' + (k === 0 ? ' class="is-on"' : '') + '></i>';

  var copy = document.createElement('div');
  copy.className = 'quiz__copy reveal';
  copy.setAttribute('data-delay', '1');
  copy.innerHTML =
    '<div class="quiz__card">' +
      '<div class="quiz__top">' +
        '<p class="quiz__count">' + b.label + ' <span class="quiz__roll"><b class="quiz__num">01</b></span> / ' + pad(n) + '</p>' +
        '<span class="quiz__segs" aria-hidden="true">' + segs + '</span>' +
      '</div>' +
      '<p class="quiz__roll quiz__line" aria-live="polite"><span class="quiz__q">' + qs[0].q + '</span></p>' +
      '<div class="quiz__opts">' + optsHtml(qs[0]) + '</div>' +
      '<div class="quiz__act">' +
        '<button class="hbtn quiz__cta" type="button" data-quiz-open aria-haspopup="dialog">' + b.cta + arrow + '</button>' +
        '<small>' + b.meta.replace('{n}', n) + '</small>' +
        '<span class="quiz__arws">' +
          '<button class="arw quiz__arw" type="button" aria-label="Previous question">' + back + '</button>' +
          '<button class="arw quiz__arw" type="button" aria-label="Next question">' + arrow + '</button>' +
        '</span>' +
      '</div>' +
    '</div>';

  mount.insertBefore(scene, mount.firstChild);
  mount.appendChild(copy);

  var imgs = scene.querySelectorAll('.quiz__img');
  var num = copy.querySelector('.quiz__num');
  var line = copy.querySelector('.quiz__q');
  var opts = copy.querySelector('.quiz__opts');
  var bars = copy.querySelectorAll('.quiz__segs i');
  var arws = copy.querySelectorAll('.quiz__arw');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var cur = 0, timer = 0, seen = false;

  function roll(el, text, dir) {
    el.style.setProperty('--dir', dir);
    el.classList.add('is-out');
    setTimeout(function () {
      el.innerHTML = text;
      el.classList.remove('is-out');
      el.classList.add('is-pre');
      void el.offsetWidth;
      el.classList.remove('is-pre');
    }, 280);
  }

  function go(i, dir) {
    i = (i + n) % n;
    if (i === cur) return;
    var a = picOf(cur), z = picOf(i);
    if (a !== z) { imgs[a].classList.remove('is-on'); imgs[z].classList.add('is-on'); }
    cur = i;
    roll(num, pad(cur + 1), dir);
    roll(line, qs[cur].q, dir);
    roll(opts, optsHtml(qs[cur]), dir);
    bars.forEach(function (s, k) { s.classList.toggle('is-on', k <= cur); });
  }

  function stop() { clearInterval(timer); timer = 0; }
  function play() {
    stop();
    if (!seen || calm.matches || n < 2) return;
    timer = setInterval(function () { go(cur + 1, 1); }, HOLD);
  }

  arws[0].addEventListener('click', function () { go(cur - 1, -1); play(); });
  arws[1].addEventListener('click', function () { go(cur + 1, 1); play(); });
  opts.addEventListener('click', function (e) {
    if (!e.target.closest('.quiz__opt') || !window.TeswayQuizOpen) return;
    stop();
    window.TeswayQuizOpen(cur);
  });
  copy.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') stop(); });
  copy.addEventListener('pointerleave', play);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      seen = en[0].isIntersecting;
      if (seen) play(); else stop();
    }, { threshold: 0.3 }).observe(mount);
  } else { seen = true; play(); }
})();
