/* ==== site.js ==== */
(function () {
  var tools = document.querySelector('.nav__tools');
  if (!tools) return;

  var KEY = 'tesway-country';
  var sites = [
    { code: 'AU', country: 'Australia', cur: 'AUD $' },
    { code: 'US', country: 'United States', cur: 'USD $' },
    { code: 'FR', country: 'France', cur: 'EUR €' },
    { code: 'DE', country: 'Germany', cur: 'EUR €' }
  ];
  var names = sites.map(function (s) { return s.country; });
  var now = Math.max(0, names.indexOf(localStorage.getItem(KEY) || 'United States'));
  var globe = '<circle cx="12" cy="12" r="7.5"/><path d="M4.5 12h15"/>';
  var draw = '<circle cx="12" cy="12" r="7.5" pathLength="1"/><path d="M4.5 12h15" pathLength="1"/>';
  var mer = '<ellipse class="site__mer" cx="12" cy="12" rx="7.5" ry="7.5"/>';

  var site = document.createElement('div');
  site.className = 'site';
  site.innerHTML =
    '<button class="nav__icon site__btn" type="button" aria-label="Choose your site" title="Choose your site" aria-haspopup="listbox" aria-expanded="false" aria-controls="siteMenu">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><g class="ico-base">' + globe + mer + mer + '</g><g class="ico-draw">' + draw + '</g></svg>' +
      '<i class="site__code"></i></button>' +
    '<div class="site__menu" id="siteMenu">' +
      '<p class="site__head">Choose your site</p>' +
      '<ul role="listbox" aria-label="Choose your site">' + sites.map(function (s, i) {
        return '<li class="site__opt" role="option" tabindex="-1" data-i="' + i + '" style="--i:' + i + '">' +
          '<b>' + s.code + '</b><span>' + s.country + '</span><small>' + s.cur + '</small></li>';
      }).join('') + '</ul></div>';
  tools.insertBefore(site, tools.firstChild);

  var btn = site.querySelector('.site__btn');
  var code = site.querySelector('.site__code');
  var opts = Array.prototype.slice.call(site.querySelectorAll('.site__opt'));

  function mark(i) {
    now = i;
    code.textContent = sites[i].code;
    opts.forEach(function (o, k) { o.setAttribute('aria-selected', String(k === i)); });
  }

  function open(v) {
    site.classList.toggle('is-open', v);
    btn.setAttribute('aria-expanded', String(v));
    if (v) opts[now].focus({ preventScroll: true });
  }

  function syncFoot(i) {
    var loc = document.querySelector('.loc');
    if (!loc) return;
    loc.querySelector('.loc__now').textContent = sites[i].country;
    loc.querySelectorAll('[role="option"]').forEach(function (o, k) { o.setAttribute('aria-selected', String(k === i)); });
  }

  function pick(i) {
    localStorage.setItem(KEY, names[i]);
    mark(i);
    syncFoot(i);
    open(false);
    btn.focus();
    site.classList.remove('is-swap');
    void site.offsetWidth;
    site.classList.add('is-swap');
    document.dispatchEvent(new CustomEvent('tesway:locale', { detail: { country: names[i], from: 'nav' } }));
  }

  mark(now);
  btn.addEventListener('click', function () { open(!site.classList.contains('is-open')); });
  opts.forEach(function (o, i) { o.addEventListener('click', function () { pick(i); }); });
  site.addEventListener('animationend', function (e) {
    if (e.animationName === 'siteSwap') site.classList.remove('is-swap');
  });

  site.addEventListener('keydown', function (e) {
    var i = opts.indexOf(document.activeElement);
    if (e.key === 'Escape') { open(false); btn.focus(); }
    else if (i > -1 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      opts[(i + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length].focus();
    } else if (i > -1 && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(i); }
  });

  document.addEventListener('click', function (e) { if (!site.contains(e.target)) open(false); });
  document.getElementById('navToggle').addEventListener('click', function () { open(false); });
  document.addEventListener('tesway:locale', function (e) {
    var i = names.indexOf(e.detail && e.detail.country);
    if (i > -1 && e.detail.from !== 'nav') mark(i);
  });
})();
