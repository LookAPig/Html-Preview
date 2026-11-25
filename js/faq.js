(function () {
  var data = window.TESWAY_FAQ;
  var list = document.getElementById('faqList');
  if (!data || !list) return;

  list.innerHTML = data.map(function (q, i) {
    return '<li class="faq__item">' +
      '<h3><button class="faq__q" type="button" aria-expanded="false" aria-controls="faq-a-' + i + '">' +
        '<span>' + q[0] + '</span><i class="faq__pm" aria-hidden="true"></i></button></h3>' +
      '<div class="faq__a" id="faq-a-' + i + '" role="region"><div><p>' + q[1] + '</p></div></div></li>';
  }).join('');

  var items = list.querySelectorAll('.faq__item');
  function toggle(el, open) {
    el.classList.toggle('is-open', open);
    el.querySelector('.faq__q').setAttribute('aria-expanded', String(open));
  }
  list.addEventListener('click', function (e) {
    var q = e.target.closest('.faq__q');
    if (!q) return;
    var el = q.closest('.faq__item');
    var open = !el.classList.contains('is-open');
    items.forEach(function (o) { toggle(o, o === el && open); });
  });
  toggle(items[0], true);

  var chat = document.querySelector('[data-chat]');
  if (chat) chat.addEventListener('click', function (e) {
    var help = document.querySelector('.dock__help');
    if (!help) return;
    e.preventDefault();
    e.stopPropagation();
    var dock = help.closest('.dock');
    if (dock.classList.contains('is-hide')) dock.querySelector('.dock__tab').click();
    if (help.getAttribute('aria-expanded') !== 'true') help.click();
  });
})();
