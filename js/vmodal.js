(function () {
  var icons = window.TESWAY_PF;
  if (!icons) return;

  var root = document.createElement('div');
  root.className = 'vmodal';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML =
    '<div class="vmodal__panel">' +
      '<div class="vmodal__top">' +
        '<div class="vmodal__txt"><p class="eyebrow eyebrow--dot"></p><strong></strong></div>' +
        '<div class="vmodal__nav">' +
          '<button class="arw" type="button" data-dir="-1" aria-label="Previous video"><span>&#8592;</span></button>' +
          '<span class="vmodal__count" aria-live="polite"></span>' +
          '<button class="arw" type="button" data-dir="1" aria-label="Next video"><span>&#8594;</span></button>' +
        '</div>' +
        '<button class="vmodal__close" type="button" aria-label="Close video">' + icons.close + '</button>' +
      '</div>' +
      '<div class="vmodal__tags" role="tablist" aria-label="Creators"></div>' +
      '<div class="vmodal__media"><video controls playsinline preload="none"></video></div>' +
    '</div>';
  document.body.appendChild(root);

  var video = root.querySelector('video');
  var txt = root.querySelector('.vmodal__txt');
  var who = txt.querySelector('p');
  var title = txt.querySelector('strong');
  var media = root.querySelector('.vmodal__media');
  var count = root.querySelector('.vmodal__count');
  var arrows = root.querySelectorAll('.vmodal__nav .arw');
  var closeBtn = root.querySelector('.vmodal__close');
  var tagBox = root.querySelector('.vmodal__tags');
  var list = [], names = [], at = 0, back = null, swapT = 0;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function buildTags() {
    names = [];
    list.forEach(function (o) { if (names.indexOf(o.name) < 0) names.push(o.name); });
    root.classList.toggle('has-tags', names.length > 1);
    tagBox.innerHTML = names.map(function (n) {
      var o = list.filter(function (x) { return x.name === n; })[0];
      var pf = o.pf && icons[o.pf] ? '<i class="is-' + o.pf + '">' + icons[o.pf].svg + '</i>' : '';
      return '<button class="vmodal__tag" type="button" role="tab" data-name="' + n + '">' + pf + n + '</button>';
    }).join('');
  }

  function load(o) {
    who.textContent = o.name;
    title.textContent = o.title;
    video.poster = o.poster || '';
    if (video.getAttribute('src') !== o.src) video.src = o.src;
    video.currentTime = 0;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  function sync() {
    var name = list[at].name;
    var group = list.filter(function (o) { return o.name === name; });
    count.innerHTML = '<b>' + pad(group.indexOf(list[at]) + 1) + '</b> / ' + pad(group.length);
    arrows[0].disabled = at === 0;
    arrows[1].disabled = at === list.length - 1;
    Array.prototype.forEach.call(tagBox.children, function (t) {
      var on = t.dataset.name === name;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', on);
      if (on && tagBox.scrollWidth > tagBox.clientWidth) {
        tagBox.scrollTo({ left: t.offsetLeft - (tagBox.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
      }
    });
  }

  function go(dir) { jump(at + dir, dir); }

  function jump(k, dir) {
    if (k < 0 || k >= list.length || k === at) return;
    at = k;
    sync();
    txt.style.setProperty('--dir', dir);
    txt.classList.remove('is-swap');
    void txt.offsetWidth;
    txt.classList.add('is-swap');
    media.classList.add('is-out');
    clearTimeout(swapT);
    swapT = setTimeout(function () {
      load(list[at]);
      media.classList.remove('is-out');
    }, 220);
  }

  function close() {
    if (!root.classList.contains('is-on')) return;
    root.classList.remove('is-on');
    root.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearTimeout(swapT);
    video.pause();
    if (back) back.focus({ preventScroll: true });
  }

  window.TeswayPlayer = {
    open: function (o) {
      back = document.activeElement;
      list = o.list && o.list.length ? o.list : [o];
      at = Math.max(0, Math.min(list.length - 1, o.at || 0));
      root.classList.toggle('has-list', list.length > 1);
      buildTags();
      txt.classList.remove('is-swap');
      media.classList.remove('is-out');
      sync();
      load(list[at]);
      root.setAttribute('aria-hidden', 'false');
      root.classList.add('is-on');
      document.body.style.overflow = 'hidden';
      closeBtn.focus({ preventScroll: true });
    }
  };

  arrows.forEach(function (b) { b.addEventListener('click', function () { go(Number(b.dataset.dir)); }); });
  tagBox.addEventListener('click', function (e) {
    var t = e.target.closest('.vmodal__tag');
    if (!t || t.dataset.name === list[at].name) return;
    var k = list.map(function (o) { return o.name; }).indexOf(t.dataset.name);
    jump(k, k > at ? 1 : -1);
  });
  closeBtn.addEventListener('click', close);
  root.addEventListener('click', function (e) { if (e.target === root) close(); });
  document.addEventListener('keydown', function (e) {
    if (!root.classList.contains('is-on')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (e.target === video) return;
      e.preventDefault();
      go(e.key === 'ArrowLeft' ? -1 : 1);
    }
  });
})();
