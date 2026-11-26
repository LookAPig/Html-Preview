/* ==== foot-data.js ==== */
window.TESWAY_FOOT = {
  brand: 'High-performance multi-purpose ebikes. Built for the city, the trail and everything between.',
  sub: {
    eyebrow: 'Newsletter',
    title: 'Ride news, <em>first.</em>',
    text: 'New drops, group rides and member-only deals. Get 10% off your first order.',
    ok: 'You’re in! Check your inbox for your 10% welcome code.',
    err: 'Please enter a valid email address.',
    note: 'By subscribing you agree to our Privacy Policy. Unsubscribe anytime.'
  },
  cols: [
    { title: 'Bikes', links: [['X1 Dual-Drive', '#hot'], ['X1 Trail Pro', '#hot'], ['X1 Family', '#hot'], ['X1 Cargo', '#hot']] },
    { title: 'Support', links: [['Help center', '#foot'], ['Warranty', '#foot'], ['Shipping & returns', '#foot'], ['Find a dealer', '#foot']] },
    { title: 'Company', links: [['About us', 'about-us.html'], ['Ride scenes', '#uses'], ['Journal', '#blog'], ['Press', '#press']] },
    { title: 'Follow us', links: [['Instagram', '#join'], ['YouTube', '#join'], ['TikTok', '#join'], ['Strava club', '#join']] }
  ],
  locales: [
    { country: 'Australia' },
    { country: 'United States' },
    { country: 'France' },
    { country: 'Germany' }
  ],
  locale: 'United States',
  pays: [
    { name: 'Visa', html: '<b class="pay--visa">VISA</b>' },
    { name: 'Mastercard', html: '<svg viewBox="0 0 32 20"><circle cx="12" cy="10" r="7" fill="#222" opacity=".9"/><circle cx="20" cy="10" r="7" fill="#FE5416" opacity=".9"/></svg>' },
    { name: 'American Express', html: '<b class="pay--amex">AMEX</b>' },
    { name: 'PayPal', html: '<b class="pay--pp">PayPal</b>' },
    { name: 'Apple Pay', html: '<b>Apple Pay</b>' },
    { name: 'Google Pay', html: '<b>G Pay</b>' },
    { name: 'Shop Pay', html: '<b>Shop Pay</b>' },
    { name: 'Klarna', html: '<b>Klarna.</b>' }
  ],
  legal: [['Privacy', '#foot'], ['Terms', '#foot'], ['Cookies', '#foot']],
  copy: '© 2026 TESWAY · Go Far Away!',
  word: 'Go Far Away!'
};

/* ==== foot.js ==== */
(function () {
  var d = window.TESWAY_FOOT;
  var foot = document.getElementById('foot');
  if (!d || !foot) return;

  var KEY = 'tesway-country';
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  var globe = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.1-3.6-8.5s1.2-6.2 3.6-8.5z"/></svg>';
  var chev = '<svg class="loc__chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m4 10 4-4 4 4"/></svg>';
  var names = d.locales.map(function (l) { return l.country; });
  var saved = Math.max(0, names.indexOf(localStorage.getItem(KEY) || d.locale));
  function label(l) { return l.country; }

  foot.innerHTML =
    '<div class="foot__in">' +
      '<div class="foot__top">' +
        '<div class="foot__sub">' +
          '<p class="eyebrow eyebrow--dot">' + d.sub.eyebrow + '</p>' +
          '<h2 class="foot__title">' + d.sub.title + '</h2>' +
          '<p class="foot__text">' + d.sub.text + '</p>' +
          '<form class="foot__form" novalidate>' +
            '<label class="foot__field"><span class="sr">Email address</span>' +
            '<input type="email" name="email" placeholder="Your email address" autocomplete="email" required></label>' +
            '<button class="hbtn foot__send" type="submit">Subscribe' + arrow + '</button>' +
          '</form>' +
          '<p class="foot__msg" role="status" aria-live="polite"></p>' +
          '<p class="foot__note">' + d.sub.note + '</p>' +
        '</div>' +
        '<nav class="foot__cols" aria-label="Footer">' + d.cols.map(function (c, i) {
          return '<div class="foot__grp"><button class="foot__head" type="button" aria-expanded="false" aria-controls="footGrp' + i + '">' +
            '<span class="eyebrow">' + c.title + '</span><i class="foot__pm" aria-hidden="true"></i></button>' +
            '<div class="foot__links" id="footGrp' + i + '"><div>' + c.links.map(function (l) {
              return '<a href="' + l[1] + '">' + l[0].replace('&', '&amp;') + '</a>';
            }).join('') + '</div></div></div>';
        }).join('') + '</nav>' +
      '</div>' +
      '<div class="foot__mid">' +
        '<div class="foot__brand"><a class="nav__logo" href="#top" aria-label="TESWAY home"><img src="Images/logo2.png" alt="TESWAY · Go Far Away" width="2875" height="624" loading="lazy" decoding="async"></a></div>' +
        '<ul class="foot__pays" aria-label="Accepted payment methods">' + d.pays.map(function (p) {
          return '<li title="' + p.name + '" aria-label="' + p.name + '">' + p.html + '</li>';
        }).join('') + '</ul>' +
        '<div class="loc">' +
          '<button class="loc__btn" type="button" aria-haspopup="listbox" aria-expanded="false">' + globe +
            '<span class="loc__now">' + label(d.locales[saved]) + '</span>' + chev + '</button>' +
          '<ul class="loc__menu" role="listbox" aria-label="Country / region">' + d.locales.map(function (l, i) {
            return '<li role="option" data-i="' + i + '" tabindex="-1"><span>' + l.country + '</span></li>';
          }).join('') + '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="foot__bottom"><p>' + d.copy + '</p><p class="foot__legal">' + d.legal.map(function (l) {
        return '<a href="' + l[1] + '">' + l[0] + '</a>';
      }).join('') + '</p></div>' +
    '</div>' +
    '<p class="foot__word" aria-hidden="true"><span>' + d.word + '</span></p>';

  var grps = foot.querySelectorAll('.foot__grp');
  grps.forEach(function (g) {
    g.querySelector('.foot__head').addEventListener('click', function () {
      var on = !g.classList.contains('is-open');
      grps.forEach(function (o) {
        o.classList.toggle('is-open', o === g && on);
        o.querySelector('.foot__head').setAttribute('aria-expanded', String(o === g && on));
      });
    });
  });

  var form = foot.querySelector('.foot__form');
  var input = form.querySelector('input');
  var msg = foot.querySelector('.foot__msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = input.value.trim() && input.checkValidity();
    msg.textContent = ok ? d.sub.ok : d.sub.err;
    msg.classList.toggle('is-err', !ok);
    form.classList.toggle('is-err', !ok);
    if (ok) { form.classList.add('is-done'); input.value = ''; input.blur(); }
  });
  input.addEventListener('input', function () { form.classList.remove('is-err', 'is-done'); msg.textContent = ''; });

  var loc = foot.querySelector('.loc');
  var btn = loc.querySelector('.loc__btn');
  var opts = Array.prototype.slice.call(loc.querySelectorAll('[role="option"]'));
  function mark(i) { opts.forEach(function (o, k) { o.setAttribute('aria-selected', k === i); }); }
  function open(v) {
    loc.classList.toggle('is-open', v);
    btn.setAttribute('aria-expanded', v);
    if (v) (opts.filter(function (o) { return o.getAttribute('aria-selected') === 'true'; })[0] || opts[0]).focus();
  }
  function pick(i) {
    localStorage.setItem(KEY, names[i]);
    loc.querySelector('.loc__now').textContent = label(d.locales[i]);
    mark(i);
    open(false);
    btn.focus();
    document.dispatchEvent(new CustomEvent('tesway:locale', { detail: d.locales[i] }));
  }
  mark(saved);
  btn.addEventListener('click', function () { open(!loc.classList.contains('is-open')); });
  opts.forEach(function (o, i) { o.addEventListener('click', function () { pick(i); }); });
  loc.addEventListener('keydown', function (e) {
    var i = opts.indexOf(document.activeElement);
    if (e.key === 'Escape') { open(false); btn.focus(); }
    else if (i > -1 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      opts[(i + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length].focus();
    } else if (i > -1 && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(i); }
  });
  document.addEventListener('click', function (e) { if (!loc.contains(e.target)) open(false); });

  var prev = document.querySelector('main > section:last-child');
  var ticking = false;
  function update() {
    ticking = false;
    var r = foot.getBoundingClientRect();
    var vh = window.innerHeight;
    var reach = Math.min(r.height, vh);
    var dist = Math.min(reach, Math.max(0, vh - r.top));
    var f = dist / reach;
    foot.style.setProperty('--f', f.toFixed(4));
    if (!prev) return;
    prev.style.setProperty('--f', f.toFixed(4));
    prev.style.setProperty('--fy', (dist * 0.6).toFixed(1) + 'px');
  }
  var desk = window.matchMedia('(min-aspect-ratio: 1/1)');
  function onScroll() {
    if (ticking || calm.matches || !desk.matches) return;
    ticking = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  var root = document.documentElement.style;
  function range() {
    var vh = window.innerHeight;
    var top = foot.getBoundingClientRect().top + window.scrollY;
    var reach = Math.min(foot.offsetHeight, vh);
    root.setProperty('--foot-s', Math.max(0, top - vh).toFixed(0) + 'px');
    root.setProperty('--foot-e', Math.max(1, top - vh + reach).toFixed(0) + 'px');
    root.setProperty('--foot-r', reach.toFixed(0) + 'px');
  }
  window.addEventListener('resize', range);
  window.addEventListener('load', range);
  if (window.ResizeObserver) new ResizeObserver(range).observe(document.body);
  range();

  var word = foot.querySelector('.foot__word');
  var span = word.firstChild;
  function fit() {
    var fs = 100;
    for (var i = 0; i < 2; i++) {
      word.style.fontSize = fs + 'px';
      var w = span.getBoundingClientRect().width;
      if (!w) return;
      fs = Math.floor(fs * word.clientWidth / w * 100) / 100;
    }
    word.style.fontSize = fs + 'px';
  }
  window.addEventListener('resize', fit);
  if (document.fonts) document.fonts.ready.then(fit);
  fit();
})();
