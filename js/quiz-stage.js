(function () {
  var data = window.TESWAY_QUIZ;
  var mount = document.getElementById('quizMount');
  if (!data || !mount || !data.questions.length) return;

  var b = data.banner, qs = data.questions, n = qs.length, E = data.email, D = data.done;
  var arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  var tick = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5"/></svg>';
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  var pics = [];
  qs.forEach(function (q, i) {
    var src = q.img || b.scenes[i % b.scenes.length];
    if (pics.indexOf(src) < 0) pics.push(src);
  });
  function picOf(i) { return pics.indexOf(qs[i].img || b.scenes[i % b.scenes.length]); }
  function pad(v) { return String(v).padStart(2, '0'); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, calm.matches ? 0 : ms); }); }

  var scene = document.createElement('div');
  scene.className = 'quiz__scene';
  scene.setAttribute('aria-hidden', 'true');
  scene.innerHTML = pics.map(function (src, i) {
    return '<img class="quiz__img' + (i === picOf(0) ? ' is-on' : '') + '" src="' + src + '" alt="" loading="lazy" decoding="async">';
  }).join('');

  var segs = '';
  for (var k = 0; k < n; k++) segs += '<i></i>';

  var copy = document.createElement('div');
  copy.className = 'quiz__copy reveal';
  copy.setAttribute('data-delay', '1');
  copy.innerHTML =
    '<div class="quiz__card">' +
      '<div class="quiz__top">' +
        '<p class="quiz__count"><span class="quiz__roll"><span class="quiz__lab"></span></span></p>' +
        '<span class="quiz__segs" aria-hidden="true">' + segs + '</span>' +
      '</div>' +
      '<div class="quiz__body" aria-live="polite"></div>' +
    '</div>';

  mount.insertBefore(scene, mount.firstChild);
  mount.appendChild(copy);

  var imgs = scene.querySelectorAll('.quiz__img');
  var lab = copy.querySelector('.quiz__lab');
  var body = copy.querySelector('.quiz__body');
  var bars = copy.querySelectorAll('.quiz__segs i');
  var step = 0, picks = [], busy = false, pic = picOf(0);

  function labHtml(s) {
    if (s === 'done') return D.label;
    if (s >= n) return E.label;
    return b.label + ' <b class="quiz__num">' + pad(s + 1) + '</b> / ' + pad(n);
  }

  function qView(i) {
    var q = qs[i];
    return '<p class="quiz__line" id="quizQ">' + q.q + '</p>' +
      '<div class="quiz__opts" role="radiogroup" aria-labelledby="quizQ">' +
      q.options.map(function (o, j) {
        return '<button class="quiz__opt" type="button" role="radio" aria-checked="false" title="' + o.hint + '" style="--i:' + j + '">' +
          '<i class="quiz__key" aria-hidden="true">' + String.fromCharCode(65 + j) + '</i><span>' + o.label + '</span>' +
          '<i class="quiz__go" aria-hidden="true">' + arrow + tick + '</i></button>';
      }).join('') + '</div>' +
      '<p class="quiz__meta"><span>' + b.meta.replace('{n}', n) + '</span><span>' + b.tip + '</span></p>';
  }

  function emailView() {
    return '<p class="quiz__line">' + E.title + '</p>' +
      '<p class="quiz__sub">' + E.sub + '</p>' +
      '<p class="quiz__tags">' + picks.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</p>' +
      '<form class="quiz__form" novalidate>' +
        '<span class="quiz__field">' +
          '<input type="email" name="email" placeholder="' + E.placeholder + '" autocomplete="email" aria-label="Email" required>' +
          '<button class="hbtn quiz__send" type="submit">' + E.submit + arrow + '</button>' +
        '</span>' +
        '<small class="quiz__msg" aria-live="assertive"></small>' +
      '</form>';
  }

  function doneView() {
    return '<div class="quiz__done"><i class="quiz__badge">' + tick + '</i>' +
      '<div><p class="quiz__line">' + D.title + '</p><p class="quiz__sub">' + D.sub + '</p></div></div>' +
      '<div class="quiz__act">' +
        '<a class="hbtn quiz__cta" href="' + D.href + '">' + D.btn + arrow + '</a>' +
        '<button class="quiz__again" type="button">' + D.again + '</button>' +
      '</div>';
  }

  function render() {
    body.innerHTML = step === 'done' ? doneView() : step >= n ? emailView() : qView(step);
  }

  function paint() {
    var on = step === 'done' || step >= n ? n : step;
    bars.forEach(function (s, k) { s.classList.toggle('is-on', k < on); s.classList.toggle('is-cur', k === on); });
    copy.classList.toggle('is-done', step === 'done');
  }

  function showPic(i) {
    if (i === pic || !imgs[i]) return;
    imgs[pic].classList.remove('is-on');
    imgs[pic = i].classList.add('is-on');
  }

  function roll(el, html) {
    el.classList.add('is-out');
    setTimeout(function () {
      el.innerHTML = html;
      el.classList.remove('is-out');
      el.classList.add('is-pre');
      void el.offsetWidth;
      el.classList.remove('is-pre');
    }, calm.matches ? 0 : 260);
  }

  function swap(next) {
    var prev = step;
    busy = true;
    body.classList.remove('is-in');
    body.classList.add('is-out');
    var same = typeof prev === 'number' && typeof next === 'number' && prev < n && next < n;
    var num = lab.querySelector('.quiz__num');
    if (same && num) roll(num, pad(next + 1)); else roll(lab, labHtml(next));
    step = next;
    paint();
    if (typeof next === 'number' && next < n) showPic(picOf(next));
    else if (next === 'done') showPic(0);
    return wait(260).then(function () {
      var h0 = body.offsetHeight;
      render();
      body.style.height = h0 + 'px';
      body.classList.remove('is-out');
      void body.offsetWidth;
      body.style.height = body.scrollHeight + 'px';
      body.classList.add('is-in');
      return wait(460);
    }).then(function () {
      body.style.height = '';
      busy = false;
      var input = body.querySelector('input');
      if (input && window.matchMedia('(hover: hover)').matches) input.focus({ preventScroll: true });
    });
  }

  function pick(btn) {
    if (busy) return;
    busy = true;
    body.querySelectorAll('.quiz__opt').forEach(function (o) {
      o.classList.toggle('is-on', o === btn);
      o.setAttribute('aria-checked', o === btn);
    });
    body.classList.add('is-picked');
    picks[step] = btn.querySelector('span').textContent;
    wait(420).then(function () {
      body.classList.remove('is-picked');
      swap(step + 1);
    });
  }

  function submit(form) {
    var input = form.querySelector('input');
    var msg = form.querySelector('.quiz__msg');
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      form.classList.add('is-sending');
      return wait(380).then(function () { swap('done'); });
    }
    msg.textContent = E.err;
    form.classList.remove('is-shake');
    void form.offsetWidth;
    form.classList.add('is-shake', 'is-err');
    input.focus();
  }

  body.addEventListener('click', function (e) {
    var opt = e.target.closest('.quiz__opt');
    if (opt) return pick(opt);
    if (e.target.closest('.quiz__again') && !busy) { picks = []; swap(0); }
  });
  body.addEventListener('submit', function (e) { e.preventDefault(); if (!busy) submit(e.target); });
  body.addEventListener('input', function (e) {
    var form = e.target.closest('.quiz__form');
    if (form && form.classList.contains('is-err')) {
      form.classList.remove('is-err');
      form.querySelector('.quiz__msg').textContent = '';
    }
  });

  lab.innerHTML = labHtml(0);
  render();
  paint();
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { body.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(body);
  }
})();
