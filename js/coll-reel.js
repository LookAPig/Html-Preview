(function () {
  var d = window.TESWAY_COLL;
  var cr = window.TESWAY_CREATORS;
  var icons = window.TESWAY_PF;
  if (!d || !d.reels || !cr || !icons) return;

  var canPeek = window.matchMedia('(hover: hover) and (min-aspect-ratio: 1/1)');
  var STEP = 3200;

  function reviews(id) {
    return (d.reels[id] || []).map(function (r) {
      var c = cr.creators[r[0]], v = c.videos[r[1]];
      return { name: c.name, short: c.short, pf: c.platform, title: v[0], poster: v[1], dur: v[2], views: v[3] };
    });
  }

  window.TeswayReel = {
    chip: function (p) {
      var r = reviews(p.id);
      if (!r.length) return '';
      return '<button class="pc__reel" type="button" data-reel="' + p.id + '" aria-label="Watch ' + r.length + ' creator video reviews of ' + p.name + '">' +
        '<span class="pc__rplay">' + icons.play + '</span>' +
        '<span class="pc__ppl" aria-hidden="true">' + r.map(function (x) { return '<i style="background-image:url(' + x.poster + ')"></i>'; }).join('') + '</span>' +
        '<span class="pc__rtxt">' + r.length + ' <span>creator </span>reviews</span></button>' +
        '<div class="pc__peek" aria-hidden="true"><div class="pc__pcap"></div></div>';
    }
  };

  var grid = document.getElementById('collGrid');
  if (!grid) return;

  var video = document.createElement('video');
  video.className = 'pc__pvid';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';
  video.setAttribute('muted', '');

  var cur = null, idx = 0, timer = 0;

  function show(k) {
    var r = reviews(cur.dataset.reel);
    idx = k % r.length;
    var x = r[idx];
    cur.nextElementSibling.querySelector('.pc__pcap').innerHTML =
      '<span class="pc__pbar">' + r.map(function (_, j) {
        return '<i class="' + (j < idx ? 'is-done' : j === idx ? 'is-on' : '') + '"></i>';
      }).join('') + '</span>' +
      '<span class="pc__pwho"><i class="pc__pava">' + x.short + '<em class="is-' + x.pf + '">' + icons[x.pf].svg + '</em></i>' +
        '<span><b>' + x.name + '</b><small>' + x.views + ' views · ' + x.dur + '</small></span></span>' +
      '<strong>' + x.title + '</strong>';
    cur.querySelectorAll('.pc__ppl i').forEach(function (a, j) { a.classList.toggle('is-on', j === idx); });
    clearTimeout(timer);
    timer = setTimeout(function () { if (cur) show(idx + 1); }, STEP);
  }

  function enter(btn) {
    if (cur === btn) return;
    leave();
    cur = btn;
    var peek = btn.nextElementSibling;
    peek.insertBefore(video, peek.firstChild);
    if (video.getAttribute('src') !== cr.src) video.src = cr.src;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
    btn.parentNode.classList.add('is-peek');
    show(0);
  }

  function leave() {
    if (!cur) return;
    clearTimeout(timer);
    cur.parentNode.classList.remove('is-peek');
    cur.querySelectorAll('.pc__ppl i').forEach(function (a) { a.classList.remove('is-on'); });
    cur = null;
    setTimeout(function () { if (!cur) video.pause(); }, 600);
  }

  grid.addEventListener('pointerover', function (e) {
    var btn = e.target.closest('.pc__reel');
    if (btn && canPeek.matches) enter(btn);
  });
  grid.addEventListener('pointerout', function (e) {
    if (cur && !cur.parentNode.contains(e.relatedTarget)) leave();
  });

  grid.addEventListener('click', function (e) {
    var hit = e.target.closest('.pc__reel, .pc__peek');
    if (!hit || !window.TeswayPlayer) return;
    var btn = hit.classList.contains('pc__reel') ? hit : hit.previousElementSibling;
    var x = reviews(btn.dataset.reel)[cur === btn ? idx : 0];
    leave();
    window.TeswayPlayer.open({ name: x.name, title: x.title, poster: x.poster, src: cr.src });
  });
})();
