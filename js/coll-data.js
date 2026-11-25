window.TESWAY_COLL = {
  sorts: [
    { id: 'featured', name: 'Featured' },
    { id: 'low', name: 'Price: low to high' },
    { id: 'high', name: 'Price: high to low' },
    { id: 'range', name: 'Longest range' }
  ],
  filters: [
    { id: 'col', name: 'Collections', type: 'chip', all: 'All ebikes', opts: [
      { id: 'sale', name: 'Ebikes on sale' }, { id: 'dual', name: 'Dual-Drive' }, { id: 'fat', name: 'Fat tire' },
      { id: 'commuter', name: 'Commuter' }, { id: 'family', name: 'Family' }, { id: 'cargo', name: 'Cargo' },
      { id: 'step', name: 'Step-through' }
    ] },
    { id: 'use', name: 'Purpose', type: 'radio', opts: [
      { id: 'commute', name: 'Daily commute' }, { id: 'cruise', name: 'Leisure / Cruise' },
      { id: 'fitness', name: 'Fitness / Active' }, { id: 'offroad', name: 'Adventure / Off-road' },
      { id: 'family', name: 'Family / Kids' }, { id: 'cargo', name: 'Cargo / Delivery' }
    ] },
    { id: 'pri', name: 'Top priority', type: 'radio', opts: [
      { id: 'comfort', name: 'Comfort' }, { id: 'range', name: 'Long range' }, { id: 'power', name: 'Power' },
      { id: 'light', name: 'Lightweight' }, { id: 'value', name: 'Budget / Value' }
    ] },
    { id: 'price', name: 'Price', type: 'check', opts: [
      { id: 'p1', name: 'Under $1,500', min: 0, max: 1500 },
      { id: 'p2', name: '$1,500 – $2,000', min: 1500, max: 2000 },
      { id: 'p3', name: 'Over $2,000', min: 2000, max: 1e9 }
    ] },
    { id: 'range', name: 'Range', type: 'check', opts: [
      { id: 'r1', name: 'Up to 130 km', min: 0, max: 130 },
      { id: 'r2', name: '130 – 150 km', min: 130, max: 150 },
      { id: 'r3', name: '150 km +', min: 150, max: 1e9 }
    ] },
    { id: 'motor', name: 'Motor', type: 'check', opts: [{ id: 'single', name: 'Single motor' }, { id: 'dual', name: 'Dual motor' }] },
    { id: 'frame', name: 'Frame', type: 'check', opts: [{ id: 'over', name: 'Step-over' }, { id: 'step', name: 'Step-through' }] }
  ],
  swatches: {
    black: { name: 'Matte Black', hex: '#262626' },
    grey: { name: 'Stone Grey', hex: '#A9ACB0' },
    sage: { name: 'Sage Green', hex: '#8FA28F' },
    sand: { name: 'Desert Sand', hex: '#D6C4A3' },
    blue: { name: 'Mist Blue', hex: '#9DB7C9' },
    volt: { name: 'Volt Orange', hex: '#FE5416' }
  },
  apr: { months: 24, by: 'Klarna' },
  items: [
    { id: 'dual', name: 'X1 Dual-Drive', img: 'Images/hot/bike-dual', price: 1899, was: 2299, tag: 'Best seller',
      rate: 4.9, reviews: 328, colors: ['black', 'grey', 'volt'],
      line: 'Two motors. Every road, every weather.', range: 160, specs: ['160 km', '120 N·m', 'Dual motor'],
      col: ['sale', 'dual', 'fat'], use: ['commute', 'cruise', 'offroad'], pri: ['power', 'range'], motor: 'dual', frame: 'over' },
    { id: 'trail', name: 'X1 Trail Pro', img: 'Images/hot/bike-trail', price: 2399, tag: 'New',
      rate: 4.8, reviews: 96, colors: ['black', 'sage'],
      line: 'Full suspension built for the long way round.', range: 140, specs: ['140 km', '30° climb', 'Full sus'],
      col: ['dual', 'fat'], use: ['fitness', 'offroad'], pri: ['power', 'comfort'], motor: 'dual', frame: 'over' },
    { id: 'city', name: 'X1 City', img: 'Images/hot/bike-city', price: 1499,
      rate: 4.7, reviews: 214, colors: ['black', 'grey', 'blue', 'sand'],
      line: 'Light, quick and made for the daily commute.', range: 120, specs: ['120 km', '22 kg', 'Belt drive'],
      col: ['commuter'], use: ['commute', 'fitness'], pri: ['light', 'value'], motor: 'single', frame: 'over' },
    { id: 'family', name: 'X1 Family', img: 'Images/hot/bike-family', price: 1699, tag: 'New',
      rate: 4.9, reviews: 142, colors: ['sand', 'sage', 'black'],
      line: 'A child seat, a low frame and calm power.', range: 130, specs: ['130 km', '150 kg load', 'Child seat'],
      col: ['family', 'step'], use: ['family', 'cruise', 'commute'], pri: ['comfort'], motor: 'single', frame: 'step' },
    { id: 'citystep', name: 'X1 City Step', img: 'Images/hot/bike-city', price: 1399,
      rate: 4.6, reviews: 87, colors: ['blue', 'grey', 'black'],
      line: 'Step-through frame, easy for every rider.', range: 110, specs: ['110 km', 'Low step', '3 sizes'],
      col: ['commuter', 'step'], use: ['commute', 'cruise'], pri: ['comfort', 'light', 'value'], motor: 'single', frame: 'step' },
    { id: 'cargo', name: 'X1 Cargo', img: 'Images/hot/bike-cargo', price: 1999, tag: 'Pro',
      rate: 4.8, reviews: 175, colors: ['black', 'grey'],
      line: 'More orders per charge, all day long.', range: 160, specs: ['160 km', '50 kg rack', 'Dual battery'],
      col: ['cargo', 'fat'], use: ['cargo', 'family'], pri: ['range', 'power'], motor: 'dual', frame: 'over' }
  ],
  perks: [
    { title: 'Free shipping', text: 'On every bike, ready to ride', icon: 'M3.5 7.5h10v8h-10zM13.5 10.5h4l3 3v2h-7zM7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' },
    { title: '30-day returns', text: 'Ride it, love it or send it back', icon: 'M5 12a7 7 0 1 0 2-4.9M5 4.5v3.5h3.5' },
    { title: '2-year warranty', text: 'Frame, motor and battery', icon: 'M12 3.5 5 6.5v5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9v-5zM9 12l2.2 2.2L15.5 10' },
    { title: '0% APR financing', text: 'From $79 / month with Klarna', icon: 'M3.5 6.5h17v11h-17zM3.5 10h17M7 14.5h4' }
  ]
};
