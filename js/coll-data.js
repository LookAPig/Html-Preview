window.TESWAY_COLL = {
  cats: [
    { id: 'all', name: 'All bikes' },
    { id: 'dual', name: 'Dual-Drive' },
    { id: 'family', name: 'Family' },
    { id: 'cargo', name: 'Cargo' }
  ],
  sorts: [
    { id: 'featured', name: 'Featured' },
    { id: 'low', name: 'Price: low to high' },
    { id: 'high', name: 'Price: high to low' },
    { id: 'range', name: 'Longest range' }
  ],
  items: [
    { id: 'dual', cat: 'dual', name: 'X1 Dual-Drive', img: 'Images/hot/bike-dual', price: 1899, was: 2299, tag: 'Best seller',
      line: 'Two motors. Every road, every weather.', range: 160, specs: ['160 km', '120 N·m', 'Dual motor'] },
    { id: 'trail', cat: 'dual', name: 'X1 Trail Pro', img: 'Images/hot/bike-trail', price: 2399, tag: 'New',
      line: 'Full suspension built for the long way round.', range: 140, specs: ['140 km', '30° climb', 'Full sus'] },
    { id: 'city', cat: 'dual', name: 'X1 City', img: 'Images/hot/bike-city', price: 1499,
      line: 'Light, quick and made for the daily commute.', range: 120, specs: ['120 km', '22 kg', 'Belt drive'] },
    { id: 'family', cat: 'family', name: 'X1 Family', img: 'Images/hot/bike-family', price: 1699, tag: 'New',
      line: 'A child seat, a low frame and calm power.', range: 130, specs: ['130 km', '150 kg load', 'Child seat'] },
    { id: 'citystep', cat: 'family', name: 'X1 City Step', img: 'Images/hot/bike-city', price: 1399,
      line: 'Step-through frame, easy for every rider.', range: 110, specs: ['110 km', 'Low step', '3 sizes'] },
    { id: 'cargo', cat: 'cargo', name: 'X1 Cargo', img: 'Images/hot/bike-cargo', price: 1999, tag: 'Pro',
      line: 'More orders per charge, all day long.', range: 160, specs: ['160 km', '50 kg rack', 'Dual battery'] }
  ],
  perks: [
    { title: 'Free shipping', text: 'On every bike, ready to ride', icon: 'M3.5 7.5h10v8h-10zM13.5 10.5h4l3 3v2h-7zM7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' },
    { title: '30-day returns', text: 'Ride it, love it or send it back', icon: 'M5 12a7 7 0 1 0 2-4.9M5 4.5v3.5h3.5' },
    { title: '2-year warranty', text: 'Frame, motor and battery', icon: 'M12 3.5 5 6.5v5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9v-5zM9 12l2.2 2.2L15.5 10' },
    { title: '0% APR financing', text: 'From $79 / month with Klarna', icon: 'M3.5 6.5h17v11h-17zM3.5 10h17M7 14.5h4' }
  ]
};
