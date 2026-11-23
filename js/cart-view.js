(function () {
  var d = window.TESWAY_CART;
  if (!d) return;

  var svg = function (body, cls) {
    return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  };
  var ico = {
    x: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
    minus: svg('<path d="M6 12h12"/>'),
    plus: svg('<path d="M12 6v12M6 12h12"/>'),
    trash: svg('<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>'),
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    cart: svg('<path d="M3.8 5.2h2l2 9.4h10l1.7-6.6H8.4"/><circle cx="10" cy="17.6" r="1.2"/><circle cx="16.4" cy="17.6" r="1.2"/>')
  };

  function money(n) { return d.cur + n.toLocaleString('en-US'); }

  function pic(p) {
    return p.img
      ? '<span class="ci__pic"><img src="' + p.img + '" alt="" loading="lazy" decoding="async"></span>'
      : '<span class="ci__pic is-ico">' + svg(p.icon) + '</span>';
  }

  function price(p, qty) {
    return (p.was ? '<s>' + money(p.was * qty) + '</s>' : '') + '<em>' + money(p.price * qty) + '</em>';
  }

  function line(p, qty) {
    return '<li class="ci" data-id="' + p.id + '">' + pic(p) +
      '<div class="ci__info">' +
        '<div class="ci__top"><div><b>' + p.name + '</b><small>' + p.variant + '</small></div>' +
          '<button class="ci__rm" type="button" data-rm aria-label="Remove ' + p.name + '">' + ico.trash + '</button></div>' +
        '<div class="ci__row">' +
          '<div class="qty" role="group" aria-label="Quantity">' +
            '<button type="button" data-q="-1" aria-label="Decrease">' + ico.minus + '</button>' +
            '<output aria-live="polite">' + qty + '</output>' +
            '<button type="button" data-q="1" aria-label="Increase">' + ico.plus + '</button></div>' +
          '<span class="ci__price">' + price(p, qty) + '</span>' +
        '</div></div></li>';
  }

  function addon(p) {
    return '<button class="add" type="button" data-add="' + p.id + '">' +
      '<span class="add__pic">' + svg(p.icon) + '</span>' +
      '<span class="add__txt"><b>' + p.name + '</b><small>' + money(p.price) + '</small></span>' +
      '<i class="add__plus">' + ico.plus + '</i></button>';
  }

  function shell() {
    var t = d.text;
    return '<div class="cart__scrim" data-close></div>' +
      '<div class="cart__panel">' +
        '<header class="cart__head"><h2 id="cartTitle">' + t.title + '<sup class="cart__count">0</sup></h2>' +
          '<button class="cart__x" type="button" data-close aria-label="Close cart">' + ico.x + '</button></header>' +
        '<div class="cart__ship"><p class="cart__ship-txt"></p><span class="cart__bar"><i></i></span></div>' +
        '<div class="cart__body">' +
          '<ul class="cart__list"></ul>' +
          '<div class="cart__empty"><span class="cart__empty-ico">' + ico.cart + '</span><b>' + t.empty + '</b><p>' + t.emptySub + '</p>' +
            '<a class="hbtn cart__shop" href="#hot" data-close>' + t.emptyCta + ico.arrow + '</a></div>' +
          '<div class="cart__more"><p class="eyebrow">' + t.addons + '</p><div class="cart__adds"></div></div>' +
        '</div>' +
        '<footer class="cart__foot">' +
          '<dl class="cart__sum"><div><dt>Subtotal</dt><dd class="cart__sub"></dd></div>' +
            '<div><dt>Shipping</dt><dd class="cart__fee"></dd></div></dl>' +
          '<button class="hbtn cart__go" type="button"><span class="cart__go-txt">' + t.checkout + '</span><b class="cart__total"></b>' + ico.arrow + '</button>' +
          '<p class="cart__note">' + t.note + '</p>' +
        '</footer>' +
      '</div>';
  }

  window.TeswayCartView = { money: money, price: price, line: line, addon: addon, shell: shell };
})();
