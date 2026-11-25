/* ==== blog-data.js ==== */
window.TESWAY_BLOG = {
  cats: ['All', 'Guides', 'Rides', 'Tech', 'News'],
  authors: {
    Rides: { name: 'Maya Chen', role: 'Field editor' },
    Guides: { name: 'Jake Ortiz', role: 'Head mechanic' },
    Tech: { name: 'Lena Brooks', role: 'Product engineer' },
    News: { name: 'Sam Patel', role: 'Community lead' }
  },
  posts: [
    {
      cat: 'Rides',
      title: 'Two days, 140 miles: a dual-drive weekend through the high desert',
      text: 'We packed light, charged once and let the X1 Trail Pro pick the line from sunrise to the last campfire.',
      date: 'Nov 12, 2026',
      read: 8,
      img: 'Images/hero-trail.jpg'
    },
    {
      cat: 'Guides',
      title: 'How to get the most range out of every charge this winter',
      text: 'Tyre pressure, assist levels and battery care tips that add real miles when the temperature drops.',
      date: 'Nov 3, 2026',
      read: 5,
      img: 'Images/story-delivery.jpg'
    },
    {
      cat: 'Tech',
      title: 'Inside the dual-motor system: why two hubs climb better than one',
      text: 'Our engineers break down torque split, traction control and what happens on loose gravel.',
      date: 'Oct 21, 2026',
      read: 6,
      img: 'Images/bike-dual.jpg'
    },
    {
      cat: 'Rides',
      title: 'The school run, reinvented: one family swaps the second car',
      text: 'Six months, two kids and a cargo rack later, the Millers share what changed in their week.',
      date: 'Oct 9, 2026',
      read: 7,
      img: 'Images/story-family.jpg'
    },
    {
      cat: 'News',
      title: 'TESWAY opens 40 new test-ride points across the country',
      text: 'Book a free 30-minute ride near you and try every model before you choose.',
      date: 'Sep 28, 2026',
      read: 3,
      img: 'Images/bike-city.jpg'
    },
    {
      cat: 'Guides',
      title: 'First e-bike? Ten things we wish every new rider knew',
      text: 'From fitting the saddle to reading the display, a calm start for your first hundred miles.',
      date: 'Sep 14, 2026',
      read: 6,
      img: 'Images/bike-family.jpg'
    },
    {
      cat: 'Tech',
      title: 'Built to haul: how we tested the X1 Cargo frame to 400 lb',
      text: 'Drop tests, fatigue rigs and a very patient loading dock crew.',
      date: 'Aug 30, 2026',
      read: 4,
      img: 'Images/bike-cargo.jpg'
    },
    {
      cat: 'Rides',
      title: 'Dawn patrol: riding to the lake before the first cast',
      text: 'Rod rack on, lights off and a silent motor that never spooks the fish.',
      date: 'Aug 18, 2026',
      read: 5,
      img: 'Images/scenes/scene-fishing.jpg'
    },
    {
      cat: 'News',
      title: 'Winter Ride Week: free accessories with every X1 order',
      text: 'Fenders, lights and a cargo bag on us until the end of the month.',
      date: 'Aug 2, 2026',
      read: 2,
      img: 'Images/story-camp.jpg'
    },
    {
      cat: 'Guides',
      title: 'A five-minute pre-ride check that keeps you rolling',
      text: 'Brakes, bolts, battery and tyres, the quick routine our mechanics swear by.',
      date: 'Jul 20, 2026',
      read: 4,
      img: 'Images/scenes/scene-farm.jpg'
    },
    {
      cat: 'News',
      title: 'TESWAY joins the 2026 Outdoor Retailer show floor',
      text: 'Come ride the full line-up and meet the team behind the dual-drive platform.',
      date: 'Jul 6, 2026',
      read: 3,
      img: 'Images/scenes/scene-hunting.jpg'
    },
    {
      cat: 'Tech',
      title: 'Fat tyres explained: grip, comfort and the right pressure for you',
      text: 'What 4-inch tyres really change on sand, snow and broken city streets.',
      date: 'Jun 22, 2026',
      read: 5,
      img: 'Images/bike-trail.jpg'
    },
    {
      cat: 'Rides',
      title: 'Coast to campsite: an easy overnighter with the whole crew',
      text: 'Forty miles of shoreline, one charge and a tent strapped to the rack.',
      date: 'Jun 8, 2026',
      read: 6,
      img: 'Images/hero-family.jpg'
    },
    {
      cat: 'Guides',
      title: 'Choosing your first TESWAY: a no-jargon buying guide',
      text: 'Range, motors and frame sizes explained in plain words, with a quick quiz to finish.',
      date: 'May 25, 2026',
      read: 7,
      img: 'Images/quiz-banner.jpg'
    },
    {
      cat: 'Tech',
      title: 'Smart display 2.0: ride data, navigation and theft alerts',
      text: 'A closer look at the new firmware rolling out to every X1 this spring.',
      date: 'May 11, 2026',
      read: 4,
      img: 'Images/hero-trail-m.jpg'
    },
    {
      cat: 'News',
      title: 'Free doorstep delivery now covers every mainland address',
      text: 'Your bike arrives fully built, tuned and ready to ride the same day.',
      date: 'Apr 27, 2026',
      read: 2,
      img: 'Images/hero-desktop.jpg'
    }
  ]
};

/* ==== blog.js ==== */
(function () {
  var data = window.TESWAY_BLOG;
  var box = document.getElementById('blogBox');
  if (!data || !box) return;

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  var current = '';
  var swapT = 0;

  function author(p, lead) {
    var a = data.authors[p.cat];
    var ini = a.name.split(' ').map(function (w) { return w[0]; }).join('');
    return '<span class="bpost__by"><i class="bpost__ava bpost__ava--' + p.cat.toLowerCase() + '" aria-hidden="true">' + ini + '</i>' +
      '<span><b>' + a.name + '</b>' + (lead ? '<small>' + a.role + '</small>' : '') + '</span></span>';
  }

  function post(p, k, lead) {
    return '<a class="bpost' + (lead ? ' bpost--lead' : '') + '" href="#blog" style="--i:' + k + '">' +
      '<span class="bpost__img"><img src="' + p.img + '" alt="" loading="lazy" decoding="async"></span>' +
      '<span class="bpost__body">' +
        '<span class="bpost__meta"><b>' + p.cat + '</b><i></i>' + p.date + '<i></i>' + p.read + ' min read</span>' +
        '<strong class="bpost__title"><span>' + p.title + '</span></strong>' +
        (lead ? '<span class="bpost__text">' + p.text + '</span><span class="bpost__foot">' + author(p, true) +
          '<span class="bpost__more">Read story' + arrow + '</span></span>' : author(p, false)) +
      '</span></a>';
  }

  box.innerHTML =
    '<div class="blog__bar">' +
      '<div class="blog__cats" role="tablist" aria-label="Blog categories">' + data.cats.map(function (c) {
        return '<button class="blog__cat" type="button" role="tab" data-cat="' + c + '">' + c + '</button>';
      }).join('') + '</div>' +
      '<a class="hbtn hbtn--line blog__all" href="#blog">View all stories' + arrow + '</a>' +
    '</div>' +
    '<div class="blog__grid" aria-live="polite"></div>';

  var grid = box.querySelector('.blog__grid');
  var cats = Array.prototype.slice.call(box.querySelectorAll('.blog__cat'));

  function fill(cat) {
    var list = data.posts.filter(function (p) { return cat === 'All' || p.cat === cat; }).slice(0, 4);
    grid.innerHTML = post(list[0], 0, true) +
      '<div class="blog__list">' + list.slice(1).map(function (p, k) { return post(p, k + 1, false); }).join('') + '</div>';
  }

  function set(cat) {
    if (cat === current) return;
    var first = !current;
    current = cat;
    cats.forEach(function (b) {
      var on = b.dataset.cat === cat;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on);
    });
    clearTimeout(swapT);
    if (first || calm.matches) { fill(cat); return; }
    grid.classList.add('is-out');
    swapT = setTimeout(function () {
      fill(cat);
      grid.classList.remove('is-out');
    }, 280);
  }

  cats.forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.cat); }); });
  set(data.cats[0]);
})();
