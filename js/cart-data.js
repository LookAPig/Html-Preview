window.TESWAY_CART = {
  cur: '$',
  freeShip: 2000,
  shipFee: 79,
  products: [
    { id: 'dual', name: 'X1 Dual-Drive', variant: 'Graphite · Size M', img: 'Images/bike-dual.jpg', price: 1899, was: 2299 },
    { id: 'trail', name: 'X1 Trail Pro', variant: 'Sand · Size L', img: 'Images/bike-trail.jpg', price: 2399 },
    { id: 'family', name: 'X1 Family', variant: 'Ivory · One size', img: 'Images/bike-family.jpg', price: 1699 },
    { id: 'cargo', name: 'X1 Cargo', variant: 'Black · One size', img: 'Images/bike-cargo.jpg', price: 1999 },
    { id: 'helmet', name: 'Trail helmet', variant: 'MIPS · M/L', price: 89,
      icon: '<path d="M4 15a8 8 0 0 1 16 0v1H4z"/><path d="M9 8.2c1.2 1.4 1.8 3.6 1.8 6.8M15 8.2c-1.2 1.4-1.8 3.6-1.8 6.8"/><path d="M4 16h16l-1.2 2.4H5.2z"/>' },
    { id: 'lock', name: 'U-lock pro', variant: 'Sold Secure Gold', price: 59,
      icon: '<path d="M7.5 11V8.5a4.5 4.5 0 0 1 9 0V11"/><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M12 14.5v2"/>' },
    { id: 'bag', name: 'Pannier bag', variant: '24 L · Waterproof', price: 79,
      icon: '<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/><path d="M9.5 12h5"/>' },
    { id: 'battery', name: 'Spare battery', variant: '48V · 20Ah', price: 349,
      icon: '<rect x="7" y="4.5" width="10" height="16" rx="2"/><path d="M10 3h4"/><path d="m12.8 8.5-2.3 4h3l-2.3 4"/>' }
  ],
  start: [['dual', 1], ['helmet', 1]],
  addons: ['helmet', 'lock', 'bag', 'battery'],
  text: {
    title: 'Your cart',
    shipLeft: 'Add <b>{x}</b> more for <b>free shipping</b>',
    shipDone: 'You have unlocked <b>free shipping</b>',
    empty: 'Your cart is empty',
    emptySub: 'Find the TESWAY that fits your ride.',
    emptyCta: 'Shop best sellers',
    addons: 'Ride-ready add-ons',
    note: 'Taxes calculated at checkout · 30-day returns · 2-year warranty',
    checkout: 'Checkout',
    going: 'Securing checkout…'
  }
};
