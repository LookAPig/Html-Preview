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
        '<button class="vmodal__close" type="button" aria-label="Close video">' + icons.close + '</button>' +
      '</div>' +
      '<div class="vmodal__media"><video controls playsinline preload="none"></video></div>' +
    '</div>';
  document.body.appendChild(root);

  var video = root.querySelector('video');
  var who = root.querySelector('.vmodal__txt p');
  var title = root.querySelector('.vmodal__txt strong');
  var closeBtn = root.querySelector('.vmodal__close');
  var back = null;

  function close() {
    if (!root.classList.contains('is-on')) return;
    root.classList.remove('is-on');
    root.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    video.pause();
    if (back) back.focus({ preventScroll: true });
  }

  window.TeswayPlayer = {
    open: function (o) {
      back = document.activeElement;
      who.textContent = o.name;
      title.textContent = o.title;
      video.poster = o.poster || '';
      if (video.getAttribute('src') !== o.src) video.src = o.src;
      video.currentTime = 0;
      root.setAttribute('aria-hidden', 'false');
      root.classList.add('is-on');
      document.body.style.overflow = 'hidden';
      closeBtn.focus({ preventScroll: true });
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }
  };

  closeBtn.addEventListener('click', close);
  root.addEventListener('click', function (e) { if (e.target === root) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
