window.TESWAY_NOTICE = {
  deadline: (function () {
    var now = new Date();
    var end = new Date(now.getFullYear(), 10, 30, 23, 59, 59);
    if (end < now) end.setFullYear(end.getFullYear() + 1);
    return end.toISOString();
  })(),
  interval: 5000,
  slides: [
    {
      html: '<b>Black Friday</b> ends in',
      countdown: true,
      link: { href: '#hot', text: 'Shop now' }
    },
    {
      html: '<b>Free shipping</b> &amp; 2-year warranty on every TESWAY'
    },
    {
      html: 'Book a <b>free test ride</b> this weekend',
      link: { href: '#hot', text: 'Book now' }
    }
  ]
};
