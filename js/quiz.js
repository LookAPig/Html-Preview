(function () {
  var data = window.TESWAY_QUIZ;
  var mount = document.getElementById('quizMount');
  if (!data || !mount) return;

  var qs = data.questions;
  var total = qs.length;
  var steps = total + 1;
  var step = 0;
  var busy = false;
  var lastFocus = null;
  var xico = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var tick = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5"/></svg>';

  var modal = document.createElement('div');
  modal.className = 'qmodal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'qmodalTitle');
  modal.innerHTML =
    '<div class="qmodal__panel">' +
    '<div class="qmodal__top"><p class="qmodal__step"><b id="qStep">01</b> / ' + pad(steps) + '</p>' +
    '<span class="qmodal__bar" aria-hidden="true"><i id="qBar"></i></span>' +
    '<button class="qmodal__close" type="button" aria-label="Close">' + xico + '</button></div>' +
    '<div class="qmodal__body" id="qBody"></div></div>';
  document.body.appendChild(modal);

  var body = document.getElementById('qBody');
  var stepEl = document.getElementById('qStep');
  var bar = document.getElementById('qBar');
  var closeBtn = modal.querySelector('.qmodal__close');

  function pad(n) { return String(n).padStart(2, '0'); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function play() {
    body.classList.remove('is-in', 'is-out');
    void body.offsetWidth;
    body.classList.add('is-in');
  }

  function progress() {
    var n = Math.min(step + 1, steps);
    stepEl.textContent = pad(n);
    bar.style.transform = 'scaleX(' + (n / steps).toFixed(4) + ')';
  }

  function build() {
    if (step === 'done') return doneView();
    progress();
    if (step >= total) return emailView();
    var item = qs[step];
    body.innerHTML =
      '<h2 class="qmodal__q" id="qmodalTitle">' + item.q + '</h2>' +
      '<div class="qmodal__opts" role="radiogroup" aria-labelledby="qmodalTitle">' +
      item.options.map(function (o, i) {
        return '<button class="qmodal__opt" type="button" role="radio" aria-checked="false" style="--i:' + i + '">' +
          '<b>' + o.label + '</b><small>' + o.hint + '</small><i class="qmodal__tick">' + tick + '</i></button>';
      }).join('') + '</div>';
    body.querySelectorAll('.qmodal__opt').forEach(function (btn) {
      btn.addEventListener('click', function () { pick(btn); });
    });
  }

  function emailView() {
    var e = data.email;
    body.innerHTML =
      '<h2 class="qmodal__q" id="qmodalTitle">' + e.title + '</h2>' +
      '<p class="qmodal__sub">' + e.sub + '</p>' +
      '<form class="qmodal__form" id="qForm" novalidate>' +
      '<input type="email" id="qEmail" placeholder="' + e.placeholder + '" autocomplete="email" aria-label="Email" required>' +
      '<button class="hbtn" type="submit">' + e.submit + '</button>' +
      '<p class="qmodal__msg" id="qMsg" aria-live="polite"></p></form>';
    document.getElementById('qForm').addEventListener('submit', onSubmit);
  }

  function doneView() {
    var d = data.done;
    stepEl.textContent = pad(steps);
    bar.style.transform = 'scaleX(1)';
    body.innerHTML =
      '<div class="qmodal__done"><i class="qmodal__badge">' + tick + '</i>' +
      '<h2 class="qmodal__q" id="qmodalTitle">' + d.title + '</h2>' +
      '<p class="qmodal__sub">' + d.sub + '</p>' +
      '<button class="hbtn" type="button" id="qDone">' + d.btn + '</button></div>';
    document.getElementById('qDone').addEventListener('click', close);
  }

  function swap(next) {
    if (busy) return Promise.resolve();
    busy = true;
    body.classList.remove('is-in');
    body.classList.add('is-out');
    return wait(220).then(function () {
      var h0 = body.offsetHeight;
      step = next;
      build();
      body.style.height = h0 + 'px';
      void body.offsetWidth;
      body.style.height = body.scrollHeight + 'px';
      play();
      return wait(380);
    }).then(function () {
      body.style.height = '';
      busy = false;
      var input = document.getElementById('qEmail');
      if (input) input.focus();
    });
  }

  function pick(btn) {
    if (busy) return;
    body.querySelectorAll('.qmodal__opt').forEach(function (b) {
      b.classList.toggle('is-on', b === btn);
      b.setAttribute('aria-checked', b === btn);
    });
    body.classList.add('is-picked');
    wait(360).then(function () {
      body.classList.remove('is-picked');
      swap(step + 1);
    });
  }

  function onSubmit(ev) {
    ev.preventDefault();
    var input = document.getElementById('qEmail');
    var msg = document.getElementById('qMsg');
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    if (ok) return swap('done');
    msg.classList.add('err');
    msg.textContent = data.email.err;
    ev.target.classList.remove('is-shake');
    void ev.target.offsetWidth;
    ev.target.classList.add('is-shake');
    input.focus();
  }

  function open(start) {
    lastFocus = document.activeElement;
    step = typeof start === 'number' ? start : 0;
    busy = false;
    body.style.height = '';
    build();
    body.classList.remove('is-in', 'is-out');
    modal.classList.add('is-on');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(play);
    closeBtn.focus({ preventScroll: true });
  }

  function close() {
    if (!modal.classList.contains('is-on')) return;
    body.classList.remove('is-in');
    body.classList.add('is-out');
    modal.classList.remove('is-on');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  mount.querySelectorAll('[data-quiz-open]').forEach(function (el) { el.addEventListener('click', function () { open(0); }); });
  window.TeswayQuizOpen = open;
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
