(function () {
  var data = window.TESWAY_FAQ;
  var box = document.getElementById('faqBox');
  var input = document.getElementById('faqInput');
  if (!data || !box || !input) return;

  var desk = window.matchMedia('(min-aspect-ratio: 1/1)');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var svg = function (d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  };
  var ico = {
    go: svg('M5 12h14M13 6l6 6-6 6'),
    up: svg('M7.5 11v8.5H4.5V11zM7.5 11l3.5-6.5c1.2 0 2 .9 2 2V10h5a2 2 0 0 1 2 2.3l-1 5.5a2 2 0 0 1-2 1.7h-9.5'),
    down: svg('M7.5 13V4.5H4.5V13zM7.5 13l3.5 6.5c1.2 0 2-.9 2-2V14h5a2 2 0 0 0 2-2.3l-1-5.5a2 2 0 0 0-2-1.7h-9.5'),
    chat: svg('M5 6.5h14v9H10l-4 3.2V15.5H5z')
  };
  var all = [];
  data.forEach(function (g, gi) {
    g.items.forEach(function (q) { all.push({ gi: gi, cat: g.cat, q: q[0], a: q[1], n: all.length }); });
  });
  var cats = [{ cat: 'All' }].concat(data);
  var state = { tab: 0, term: '', on: -1 };
  var votes = {}, shown = [], swapT = 0, paT = 0;

  var pad = function (n) { return (n < 9 ? '0' : '') + (n + 1); };
  var safe = function (s) { return s.replace(/[&<>"]/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); };
  var rx = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
  function mark(s) { return state.term ? s.replace(new RegExp('(' + rx(safe(state.term)) + ')', 'gi'), '<mark>$1</mark>') : s; }
  function hit(it) { var t = state.term.toLowerCase(); return !t || (it.q + ' ' + it.a).toLowerCase().indexOf(t) > -1; }
  function inTab(it, i) { return i === 0 || it.gi === i - 1; }

  box.innerHTML =
    '<div class="faq__tabs" role="tablist" aria-label="FAQ topics">' + cats.map(function (c, i) {
      return '<button class="faq__tab" type="button" role="tab" data-i="' + i + '">' + c.cat + '<i></i></button>';
    }).join('') + '</div>' +
    '<div class="faq__body"><ol class="faq__list"></ol>' +
      '<aside class="faq__panel"><div class="faq__pa" aria-live="polite"></div>' +
        '<div class="faq__help"><span class="faq__crew" aria-hidden="true"><i>AL</i><i>MK</i><i>JS</i></span>' +
          '<span class="faq__htxt"><b>Still have questions?</b><small>Real riders reply in about 2 minutes.</small></span>' +
          '<a class="hbtn hbtn--light faq__chat" href="#foot" data-chat>' + ico.chat + 'Chat with us</a></div>' +
      '</aside></div>';

  var tabs = box.querySelectorAll('.faq__tab');
  var list = box.querySelector('.faq__list');
  var pa = box.querySelector('.faq__pa');

  function vote(it) {
    var v = votes[it.n];
    return '<div class="faq__vote' + (v != null ? ' is-done' : '') + '" data-n="' + it.n + '">' +
      '<span>' + (v != null ? 'Thanks for the feedback!' : 'Was this helpful?') + '</span>' +
      '<button class="arw' + (v === 1 ? ' is-on' : '') + '" type="button" data-vote="1" aria-label="Helpful" aria-pressed="' + (v === 1) + '">' + ico.up + '</button>' +
      '<button class="arw' + (v === 0 ? ' is-on' : '') + '" type="button" data-vote="0" aria-label="Not helpful" aria-pressed="' + (v === 0) + '">' + ico.down + '</button></div>';
  }

  function row(it, k) {
    return '<li class="faq__item" data-n="' + it.n + '" style="--i:' + k + '">' +
      '<button class="faq__q" type="button" aria-expanded="false" aria-controls="faq-a-' + it.n + '">' +
        '<span class="faq__n">' + pad(it.n) + '</span><span class="faq__t">' + mark(it.q) + '</span>' +
        '<span class="faq__go arw" aria-hidden="true">' + ico.go + '</span></button>' +
      '<div class="faq__a" id="faq-a-' + it.n + '" role="region"><div><p>' + mark(it.a) + '</p>' + vote(it) + '</div></div></li>';
  }

  function panel(it, swap) {
    var html = it
      ? '<span class="faq__big" aria-hidden="true">' + pad(it.n) + '</span>' +
        '<p class="faq__pcat"><b>' + it.cat + '</b>' + pad(it.n) + ' / ' + pad(all.length - 1) + '</p>' +
        '<h3 class="faq__pq">' + mark(it.q) + '</h3><p class="faq__pt">' + mark(it.a) + '</p>' + vote(it)
      : '<p class="faq__pcat"><b>No match</b></p><h3 class="faq__pq">Nothing found for “' + safe(state.term) + '”</h3>' +
        '<p class="faq__pt">Try another word, or ask our riders directly below.</p>';
    clearTimeout(paT);
    if (!swap || calm.matches) { pa.innerHTML = html; return; }
    pa.classList.add('is-out');
    paT = setTimeout(function () { pa.innerHTML = html; pa.classList.remove('is-out'); }, 200);
  }

  function select(n, swap) {
    var same = n === state.on;
    state.on = n;
    list.querySelectorAll('.faq__item').forEach(function (el) {
      var on = +el.dataset.n === n;
      el.classList.toggle('is-on', on);
      el.querySelector('.faq__q').setAttribute('aria-expanded', String(on));
    });
    if (n > -1 || !shown.length) panel(n > -1 ? all[n] : null, swap && !same);
  }

  function counts() {
    tabs.forEach(function (t, i) {
      t.querySelector('i').textContent = all.filter(function (it) { return inTab(it, i) && hit(it); }).length;
      t.classList.toggle('is-on', i === state.tab);
      t.setAttribute('aria-selected', String(i === state.tab));
    });
  }

  function fill(swap) {
    shown = all.filter(function (it) { return inTab(it, state.tab) && hit(it); });
    list.innerHTML = shown.length ? shown.map(row).join('') :
      '<li class="faq__none"><b>No answers for “' + safe(state.term) + '”</b><span>Try “battery”, “warranty” or “shipping”.</span></li>';
    var keep = shown.some(function (it) { return it.n === state.on; });
    if (!keep) state.on = -1;
    select(keep ? state.on : shown.length ? shown[0].n : -1, swap);
    counts();
  }

  function setTab(i) {
    if (i === state.tab) return;
    state.tab = i;
    counts();
    clearTimeout(swapT);
    if (calm.matches) return fill(false);
    list.classList.add('is-out');
    swapT = setTimeout(function () { fill(true); list.classList.remove('is-out'); }, 240);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      setTab(i);
      t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });
  });

  var search = input.parentNode;
  var wipe = search.querySelector('.faq__wipe');
  input.addEventListener('input', function () {
    state.term = input.value.trim();
    search.classList.toggle('has-val', !!input.value);
    fill(true);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && input.value) { e.preventDefault(); wipe.click(); }
  });
  wipe.addEventListener('click', function () {
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.focus();
  });

  list.addEventListener('click', function (e) {
    var q = e.target.closest('.faq__q');
    if (!q) return;
    var n = +q.closest('.faq__item').dataset.n;
    if (n !== state.on) select(n, true);
    else if (!desk.matches) select(-1);
  });
  list.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    var qs = Array.prototype.slice.call(list.querySelectorAll('.faq__q'));
    var i = qs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    var next = qs[(i + (e.key === 'ArrowDown' ? 1 : -1) + qs.length) % qs.length];
    next.focus();
    if (desk.matches) next.click();
  });
  box.addEventListener('click', function (e) {
    var b = e.target.closest('[data-vote]');
    if (!b) return;
    var n = +b.parentNode.dataset.n;
    votes[n] = +b.dataset.vote;
    box.querySelectorAll('.faq__vote[data-n="' + n + '"]').forEach(function (el) { el.outerHTML = vote(all[n]); });
  });
  desk.addEventListener('change', function () {
    if (desk.matches && state.on < 0 && shown.length) select(shown[0].n);
  });

  box.querySelector('[data-chat]').addEventListener('click', function (e) {
    var help = document.querySelector('.dock__help');
    if (!help) return;
    e.preventDefault();
    e.stopPropagation();
    var dock = help.closest('.dock');
    if (dock.classList.contains('is-hide')) dock.querySelector('.dock__tab').click();
    if (help.getAttribute('aria-expanded') !== 'true') help.click();
  });

  fill(false);
})();
