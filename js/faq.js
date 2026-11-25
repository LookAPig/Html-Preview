/* ==== faq-data.js ==== */
window.TESWAY_FAQ = [
  { cat: 'Orders & shipping', items: [
    ['How long does delivery take?', 'Most orders ship within 48 hours from our local warehouse and arrive in 3–7 business days. You get a tracking link the moment your bike leaves us.'],
    ['Is shipping really free?', 'Yes. Every TESWAY ebike ships free to the contiguous US. Accessories ship free on orders over $2,000, otherwise a flat $79 fee applies.'],
    ['How much assembly is needed?', 'Your bike arrives 90% assembled. Fit the handlebar, front wheel and pedals in about 20 minutes with the included tools, or follow our video guide.'],
    ['Can I pay monthly?', 'Pay over 6, 12 or 24 months with Klarna or Affirm at checkout. Plans start from 0% APR for eligible customers.']
  ] },
  { cat: 'Bikes & battery', items: [
    ['How far can I ride on one charge?', 'Up to 160 km on our Dual-Drive and Cargo models in Eco mode. Real range depends on rider weight, terrain, wind and assist level.'],
    ['How long does the battery take to charge?', 'A full charge takes 5–6 hours with the standard charger, or about 3 hours with the 4A fast charger. The battery is removable, so you can charge it indoors.'],
    ['Can I ride in the rain?', 'Yes. Every TESWAY is IPX5 rated against splashes and rain. Avoid pressure washers and submerging the motor or battery.'],
    ['Which model is right for me?', 'Dual-Drive for trails and long range, Family for school runs, Cargo for heavy loads. Still unsure? Take our 60-second ride finder on the home page.']
  ] },
  { cat: 'Warranty & returns', items: [
    ['What does the warranty cover?', 'Two years on the frame, motor, battery and electronics against manufacturing defects. Wear parts like tires, brake pads and chains are not covered.'],
    ['What is your return policy?', 'Ride it for 30 days. If it is not the one, send it back in its original box for a full refund. We even arrange the pickup.'],
    ['Where can I get my bike serviced?', 'Any local bike shop can service a TESWAY. We also partner with over 400 certified service points across the US.'],
    ['Do you sell spare parts?', 'Yes. Batteries, chargers, brake pads, tires and more are available from our support team and ship within 48 hours.']
  ] }
];

/* ==== faq.js ==== */
(function () {
  var data = window.TESWAY_FAQ;
  var box = document.getElementById('faqBox');
  if (!data || !box) return;

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var cat = -1, swapT = 0;
  var pad = function (n) { return (n < 9 ? '0' : '') + (n + 1); };

  box.innerHTML =
    '<div class="faq__tabs" role="tablist" aria-label="FAQ topics">' + data.map(function (g, i) {
      return '<button class="faq__tab" type="button" role="tab" data-i="' + i + '">' + g.cat + '<i>' + g.items.length + '</i></button>';
    }).join('') + '</div>' +
    '<div class="faq__list"></div>';

  var tabs = box.querySelectorAll('.faq__tab');
  var list = box.querySelector('.faq__list');

  function item(q, i) {
    var id = 'faq-' + cat + '-' + i;
    return '<div class="faq__item" style="--i:' + i + '">' +
      '<h3><button class="faq__q" type="button" aria-expanded="false" aria-controls="' + id + '">' +
        '<span class="faq__n">' + pad(i) + '</span><span class="faq__t">' + q[0] + '</span><i class="faq__plus" aria-hidden="true"></i>' +
      '</button></h3>' +
      '<div class="faq__a" id="' + id + '" role="region"><div><p>' + q[1] + '</p></div></div>' +
    '</div>';
  }

  function toggle(el, open) {
    el.classList.toggle('is-open', open);
    el.querySelector('.faq__q').setAttribute('aria-expanded', String(open));
  }

  function fill() {
    list.innerHTML = data[cat].items.map(item).join('');
    toggle(list.firstElementChild, true);
  }

  function set(i) {
    if (i === cat) return;
    var first = cat < 0;
    cat = i;
    tabs.forEach(function (t, j) {
      t.classList.toggle('is-on', j === i);
      t.setAttribute('aria-selected', String(j === i));
    });
    clearTimeout(swapT);
    if (first || calm.matches) return fill();
    list.classList.add('is-out');
    swapT = setTimeout(function () {
      fill();
      list.classList.remove('is-out');
    }, 260);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      set(i);
      t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });
  });

  list.addEventListener('click', function (e) {
    var q = e.target.closest('.faq__q');
    if (!q) return;
    var el = q.closest('.faq__item');
    var open = !el.classList.contains('is-open');
    list.querySelectorAll('.faq__item.is-open').forEach(function (o) { toggle(o, false); });
    toggle(el, open);
  });

  var chat = document.querySelector('[data-chat]');
  if (chat) chat.addEventListener('click', function (e) {
    var help = document.querySelector('.dock__help');
    if (!help) return;
    e.preventDefault();
    e.stopPropagation();
    var dock = help.closest('.dock');
    var tab = dock && dock.querySelector('.dock__tab');
    if (dock && dock.classList.contains('is-hide') && tab) tab.click();
    if (help.getAttribute('aria-expanded') !== 'true') help.click();
  });

  set(0);
})();
