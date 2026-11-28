/* ==== launch-hero.js · opening scene + ticker band ==== */
(function () {
  var K = window.TeswayPDP, L = window.TESWAY_LAUNCH;
  var $ = function (id) { return document.getElementById(id); };
  if (!K || !L || !$('lhWord')) return;
  var p = K.p, money = K.money;
  var save = p.was ? p.was - p.price : 0;
  var word = p.name.replace(/^X1\s+/, '');
  var arrow = K.svg('M5 12h14M13 6l6 6-6 6', 2);

  $('lhWord').innerHTML = word.split('').map(function (c, i) {
    return '<span style="--i:' + i + '">' + c + '</span>';
  }).join('');
  $('lhWord').style.setProperty('--mid', (word.length - 1) / 2);
  $('lhKick').textContent = L.kicker;

  $('lhBike').innerHTML =
    '<i class="lh__shadow" aria-hidden="true"></i>' +
    '<img src="' + p.img + '.webp" alt="' + p.name + ', side view" width="1152" height="864" fetchpriority="high" decoding="async">';

  $('lhDeal').innerHTML = save
    ? '<small>Save</small><b>' + money(save) + '</b><small>Launch only</small>'
    : '<small>Just</small><b>New</b><small>Launch week</small>';

  $('lhFoot').innerHTML =
    '<h1 class="lh__name">' + p.name + '</h1>' +
    '<p class="lh__line">' + p.line + '</p>' +
    '<p class="lh__price"><b>' + money(p.price) + '</b>' + (p.was ? '<s>' + money(p.was) + '</s>' : '') + '</p>' +
    '<div class="lh__cta">' +
      '<a class="hbtn lh__go" href="#offer">Claim the deal ' + arrow + '</a>' +
      '<a class="hbtn hbtn--line" href="#stats">Explore</a>' +
    '</div>';

  var items = L.ticker.map(function (t) { return t === 'Save big' && save ? 'Save ' + money(save) : t; });
  var run = items.concat(items, items).map(function (t) { return '<span>' + t + '</span>'; }).join('<i>✦</i>');
  $('ltkA').innerHTML = run;
  $('ltkB').innerHTML = run;

  requestAnimationFrame(function () { document.body.classList.add('ln-in'); });
})();
