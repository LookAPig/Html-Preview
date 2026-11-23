window.TeswayFlip = (function () {
  var HALVES = ['flip__top', 'flip__bottom', 'flip__top flip__leaf', 'flip__bottom flip__leaf'];

  function digit() {
    var el = document.createElement('span');
    el.className = 'flip';
    el.innerHTML = HALVES.map(function (c) {
      return '<span class="flip__half ' + c + '"><i>0</i></span>';
    }).join('');
    var parts = el.querySelectorAll('i');
    var state = { el: el, value: '0', top: parts[0], bottom: parts[1], leafTop: parts[2], leafBottom: parts[3] };
    return state;
  }

  function set(d, v) {
    if (d.value === v) return;
    var old = d.value;
    d.value = v;
    d.top.textContent = v;
    d.bottom.textContent = old;
    d.leafTop.textContent = old;
    d.leafBottom.textContent = v;
    clearTimeout(d.timer);
    d.el.classList.remove('go');
    void d.el.offsetWidth;
    d.el.classList.add('go');
    d.timer = setTimeout(function () {
      d.bottom.textContent = v;
      d.leafTop.textContent = v;
      d.el.classList.remove('go');
    }, 540);
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function mount(root, deadline, labels) {
    var end = new Date(deadline).getTime();
    var digits = [];
    ['days', 'hours', 'minutes', 'seconds'].forEach(function (unit, i) {
      if (i) {
        var sep = document.createElement('span');
        sep.className = 'flip-sep';
        sep.textContent = ':';
        root.appendChild(sep);
      }
      var group = document.createElement('span');
      group.className = 'flip-group';
      group.setAttribute('aria-hidden', 'true');
      for (var k = 0; k < 2; k++) {
        var d = digit();
        digits.push(d);
        group.appendChild(d.el);
      }
      if (!labels) return root.appendChild(group);
      var wrap = document.createElement('span');
      wrap.className = 'flip-unit';
      wrap.appendChild(group);
      wrap.insertAdjacentHTML('beforeend', '<small>' + labels[i] + '</small>');
      root.appendChild(wrap);
    });

    function tick() {
      var left = Math.max(0, Math.floor((end - Date.now()) / 1000));
      var str = pad(Math.min(99, Math.floor(left / 86400))) + pad(Math.floor(left / 3600) % 24) +
        pad(Math.floor(left / 60) % 60) + pad(left % 60);
      digits.forEach(function (d, i) { set(d, str[i]); });
      root.setAttribute('aria-label', str.slice(0, 2) + ' days ' + str.slice(2, 4) + ' hours ' +
        str.slice(4, 6) + ' minutes left');
      if (left > 0) setTimeout(tick, 1000 - (Date.now() % 1000));
    }
    tick();
  }

  return { mount: mount };
})();
