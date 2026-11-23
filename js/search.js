(function () {
  var s = window.TESWAY_SEARCH;
  var ix = window.TeswaySearchIndex;
  var v = window.TeswaySearchView;
  var btn = document.getElementById('navSearch');
  if (!s || !ix || !v || !btn) return;

  var KEY = 'tesway-search-recent';
  var body = document.body;
  var root = document.createElement('div');
  root.className = 'srch';
  root.id = 'search';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Search');
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = v.shell();
  body.appendChild(root);

  var input = root.querySelector('.srch__input');
  var box = root.querySelector('.srch__body');
  var form = root.querySelector('.srch__bar');
  var timer = 0, hintTimer = 0, hintI = 0, act = -1, back = null;

  function recent() {
    try { var r = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(r) ? r : []; } catch (e) { return []; }
  }
  function remember(q) {
    q = q.trim();
    if (!q) return;
    var r = recent().filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); });
    r.unshift(q);
    try { localStorage.setItem(KEY, JSON.stringify(r.slice(0, 5))); } catch (e) {}
  }

  function render() {
    var q = input.value.trim();
    root.classList.toggle('has-q', !!q);
    act = -1;
    input.removeAttribute('aria-activedescendant');
    box.innerHTML = q ? v.results(q, ix.find(q), ix.suggest(q), ix.intent(q)) : v.idle(recent());
    box.querySelectorAll('.srch__opt').forEach(function (o, i) { o.id = 'srchOpt' + i; });
    box.classList.remove('is-swap');
    void box.offsetWidth;
    box.classList.add('is-swap');
    box.scrollTop = 0;
  }

  function opts() { return box.querySelectorAll('.srch__opt'); }
  function move(d) {
    var o = opts();
    if (!o.length) return;
    if (o[act]) o[act].classList.remove('is-act');
    act = (act + 1 + d + o.length + 1) % (o.length + 1) - 1;
    if (act < 0) { input.removeAttribute('aria-activedescendant'); return; }
    o[act].classList.add('is-act');
    o[act].scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', o[act].id);
  }

  function setQ(q) { input.value = q; render(); input.focus({ preventScroll: true }); }
  function go(href) {
    remember(input.value);
    close();
    var el = href && document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function hint() {
    if (input.value) return;
    input.placeholder = 'Try “' + s.hints[hintI++ % s.hints.length] + '”';
  }

  function open() {
    if (root.classList.contains('is-on')) return;
    if (body.classList.contains('menu-open')) document.getElementById('navToggle').click();
    if (window.TeswayCart) window.TeswayCart.close();
    back = document.activeElement;
    root.style.setProperty('--base', '.3s');
    render();
    setTimeout(function () { root.style.setProperty('--base', '0s'); }, 1300);
    root.setAttribute('aria-hidden', 'false');
    root.classList.add('is-on');
    btn.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
    input.placeholder = s.text.placeholder;
    hintTimer = setInterval(hint, 2800);
    setTimeout(function () { input.focus({ preventScroll: true }); }, 80);
  }
  function close() {
    if (!root.classList.contains('is-on')) return;
    root.classList.remove('is-on');
    root.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
    clearInterval(hintTimer);
    input.blur();
    if (back) back.focus({ preventScroll: true });
  }

  btn.addEventListener('click', open);
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(render, 110);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var o = opts()[act];
    if (o) return o.click();
    var first = box.querySelector('.srch__best, .srch__card, .srch__row');
    if (first && input.value.trim()) go(first.dataset.go);
  });
  root.querySelector('.srch__wipe').addEventListener('click', function () { setQ(''); });

  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-close], [data-clear], [data-fill], [data-add], [data-term], [data-go]');
    if (!el) return;
    if (el.hasAttribute('data-close')) close();
    else if (el.hasAttribute('data-clear')) { localStorage.removeItem(KEY); render(); }
    else if (el.hasAttribute('data-fill')) setQ(el.dataset.fill + ' ');
    else if (el.hasAttribute('data-add')) {
      remember(input.value);
      close();
      if (window.TeswayCart) { window.TeswayCart.add(el.dataset.add); window.TeswayCart.open(); }
    } else if (el.hasAttribute('data-term')) { remember(el.dataset.term); setQ(el.dataset.term); }
    else go(el.dataset.go);
  });

  document.addEventListener('keydown', function (e) {
    var on = root.classList.contains('is-on');
    var typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (!on && ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)))) {
      e.preventDefault();
      return open();
    }
    if (!on) return;
    if (e.key === 'Escape') { e.preventDefault(); input.value ? setQ('') : close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
  });

  window.TeswaySearch = { open: open, close: close };
})();
