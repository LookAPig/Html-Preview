(function () {
  var sec = document.getElementById('film');
  if (!sec) return;

  var track = sec.querySelector('.film__track');
  var pin = sec.querySelector('.film__pin');
  var frame = sec.querySelector('.film__frame');
  var video = sec.querySelector('video');
  var sound = sec.querySelector('.film__sound');
  var nav = document.getElementById('nav');
  var desk = window.matchMedia('(min-aspect-ratio: 1/1)');
  var vh = 0, dist = 1, radius = 0, ins = { t: 0, s: 0, b: 0 };
  var queued = false, playing = false, full = false;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function measure() {
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    var pad = parseFloat(getComputedStyle(sec).paddingLeft);
    vh = pin.offsetHeight;
    var w = pin.offsetWidth;
    var top = (nav ? nav.offsetHeight : 0) + rem * 1.25;
    var cw = w - pad * 2;
    var ch = desk.matches ? Math.min(cw * 9 / 16, vh - top - rem * 2) : Math.min(cw * 1.5, vh - top - pad);
    ins = { t: top, s: pad, b: Math.max(0, vh - top - ch) };
    radius = rem;
    dist = vh * 0.9;
    track.style.height = (vh + dist + vh * 0.35) + 'px';
    track.style.marginTop = (rem * (desk.matches ? 3 : 1.75) - top) + 'px';
    sec.style.setProperty('--hy', (top + ch / 2) + 'px');
    update();
  }

  function setPlaying(on) {
    if (on === playing) return;
    playing = on;
    if (on) {
      if (!video.src) video.src = video.dataset.src;
      video.play().catch(function () { playing = false; });
    } else {
      video.pause();
    }
  }

  function update() {
    queued = false;
    var r = track.getBoundingClientRect();
    var p = clamp(-r.top / dist, 0, 1);
    var e = p * p * (3 - 2 * p);
    var k = 1 - e;
    frame.style.clipPath = 'inset(' + (ins.t * k).toFixed(1) + 'px ' + (ins.s * k).toFixed(1) + 'px ' +
      (ins.b * k).toFixed(1) + 'px ' + (ins.s * k).toFixed(1) + 'px round ' + (radius * k).toFixed(1) + 'px)';
    sec.style.setProperty('--p', e.toFixed(3));

    var visible = r.bottom > 0 && r.top < vh;
    if (r.bottom > 0 && r.top < vh * 1.5 && !video.src) {
      video.src = video.dataset.src;
      video.preload = 'auto';
    }
    var nowFull = p >= 0.995;
    if (nowFull !== full) {
      full = nowFull;
      sec.classList.toggle('is-full', full);
    }
    setPlaying(visible && (full || (playing && p > 0.9)));
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  video.addEventListener('playing', function () { video.classList.add('is-ready'); });
  sound.addEventListener('click', function () {
    video.muted = !video.muted;
    sound.setAttribute('aria-pressed', String(!video.muted));
    sound.setAttribute('aria-label', video.muted ? 'Turn sound on' : 'Turn sound off');
  });

  window.addEventListener('scroll', schedule, { passive: true });
  var lastW = window.innerWidth, lastH = window.innerHeight;
  window.addEventListener('resize', function () {
    var w = window.innerWidth, h = window.innerHeight;
    if (w === lastW && Math.abs(h - lastH) < 120) return schedule();
    lastW = w;
    lastH = h;
    measure();
  });
  desk.addEventListener('change', measure);
  measure();
})();
