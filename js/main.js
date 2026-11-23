(function () {
  var body = document.body;
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var fill = document.getElementById('batteryFill');
  if (!document.getElementById('loader')) {
    body.classList.remove('is-loading');
    body.classList.add('is-ready');
  }

  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', function () {
    setMenu(!body.classList.contains('menu-open'));
  });
  document.getElementById('navMenu').addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (a && !a.matches('[data-mega], [data-tmega]')) setMenu(false);
  });

  var notice = document.getElementById('notice');

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var barH = notice ? notice.offsetHeight : 0;
    document.documentElement.style.setProperty('--nav-top', Math.max(0, barH - y) + 'px');
    nav.classList.toggle('is-solid', y > 40);
    fill.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
