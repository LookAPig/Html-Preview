/* ==== uses-data.js ==== */
window.TESWAY_USES = [
  {
name: 'Hunting', img: 'Images/scenes/scene-hunting.jpg', bike: 'X1 Trail Pro',
    desc: 'Near-silent motors and fat tyres carry you deep into dawn trails without spooking the woods.',
    tags: ['Quiet drive', 'Fat tyres', 'Rear rack']
  },
  {
name: 'Fishing', img: 'Images/scenes/scene-fishing.jpg', bike: 'X1 Dual-Drive',
    desc: 'Rod on the rack, tackle on your back. Reach the far shore before the first light.',
    tags: ['Rod-ready rack', 'Gravel grip', '160 km range']
  },
  {
name: 'Off-road Riding', img: 'Images/hero-trail.jpg', bike: 'X1 Trail Pro',
    desc: 'Two motors claw up 30° gravel and loose rock, then soak up the way back down.',
    tags: ['120 N·m', '30° climb', 'Full suspension']
  },
  {
name: 'Camping', img: 'Images/story-camp.jpg', bike: 'X1 Cargo',
    desc: 'Haul the tent, the cooler and the stove, then roll on to a spot no car can reach.',
    tags: ['50 kg rack', 'Long range', 'All-terrain']
  },
  {
name: 'Farm & Ranch', img: 'Images/scenes/scene-farm.jpg', bike: 'X1 Dual-Drive',
    desc: 'Check the fences and the herd at dawn without firing up the truck.',
    tags: ['Dirt-road ready', 'All-day battery', 'Low upkeep']
  },
  {
name: 'Long-distance Touring', img: 'Images/hero-desktop.jpg', bike: 'X1 Dual-Drive',
    desc: '160 km on a single charge. Town to town, coast to coast, one battery at a time.',
    tags: ['160 km range', 'Comfort geometry', 'Dual drive']
  },
  {
name: 'Urban Delivery', img: 'Images/story-delivery.jpg', bike: 'X1 Cargo',
    desc: 'More drops per charge and a rack that takes the load, shift after shift.',
    tags: ['50 kg rack', '160 km range', 'Quick stops']
  },
  {
name: 'Family & Kids Riding', img: 'Images/story-family.jpg', bike: 'X1 Family',
    desc: 'A child seat, a low frame and calm, steady power for every weekend run.',
    tags: ['Child seat', '150 kg payload', 'Low step-through']
  }
];

/* ==== uses.js ==== */
(function () {
  var data = window.TESWAY_USES;
  var list = document.getElementById('usesList');
  if (!data || !list) return;

  var desk = window.matchMedia('(min-aspect-ratio: 1/1)');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var total = pad(data.length);
  var HOLD = 3200;
  var arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  function pad(v) { return String(v).padStart(2, '0'); }

  list.innerHTML = data.map(function (u, i) {
    return '<article class="use" aria-label="' + u.name + '" style="--i:' + i + '">' +
      '<img src="' + u.img + '" alt="' + u.name + ' with a TESWAY e-bike" loading="lazy" decoding="async">' +
      '<span class="use__no">' + pad(i + 1) + '</span>' +
      '<div class="use__body"><p class="use__eyebrow">' + pad(i + 1) + ' / ' + total + ' · Best with ' + u.bike + '</p>' +
      '<h3>' + u.name + '</h3><div class="use__more"><div><p class="use__desc">' + u.desc + '</p>' +
      '<ul class="use__tags">' + u.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      '<a class="hbtn hbtn--light use__link" href="#hot">Shop ' + u.bike + arrow + '</a></div></div></div></article>';
  }).join('');

  var items = Array.prototype.slice.call(list.children);
  var current = -1;
  var timer = 0;
  var live = false;
  var hold = false;

  function set(i) {
    if (i === current) return;
    current = i;
    items.forEach(function (el, k) { el.classList.toggle('is-on', k === i); });
  }

  function tick() {
    clearTimeout(timer);
    if (!desk.matches || calm.matches || !live || hold) return;
    timer = setTimeout(function () {
      set((current + 1) % items.length);
      tick();
    }, HOLD);
  }

  function pause() { hold = true; clearTimeout(timer); }
  function resume() { hold = false; tick(); }

  items.forEach(function (el, i) {
    el.addEventListener('pointerenter', function (e) {
      if (!desk.matches || e.pointerType !== 'mouse') return;
      pause();
      set(i);
    });
    el.addEventListener('pointerleave', function () { if (desk.matches) resume(); });
    el.addEventListener('focusin', function () { if (desk.matches) { pause(); set(i); } });
    el.addEventListener('focusout', function () { if (desk.matches) resume(); });
  });

  desk.addEventListener('change', function () {
    clearTimeout(timer);
    if (desk.matches) tick();
  });

  if ('IntersectionObserver' in window) {
    var secIo = new IntersectionObserver(function (entries) {
      live = entries.some(function (e) { return e.isIntersecting; });
      if (live) tick();
      else clearTimeout(timer);
    }, { threshold: 0.35 });
    secIo.observe(list);
  }

  set(0);
  tick();
})();
