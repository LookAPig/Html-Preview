/* ==== about-data.js ==== */
window.TESWAY_ABOUT = {
  map: {
    hq: { name: 'Shenzhen HQ', tag: 'R&D · Factory', lon: 114.1, lat: 22.5 },
    regions: [
      {
        name: 'North America', short: 'NA',
        text: 'Warehouses on both coasts, so most orders reach your door in under a week.',
        stats: [['2', 'Warehouses'], ['320+', 'Dealers'], ['3–5 d', 'Delivery']],
        pins: [
          { name: 'Los Angeles', tag: 'Warehouse', lon: -118.2, lat: 34 },
          { name: 'New Jersey', tag: 'Warehouse', lon: -74.2, lat: 40.7 },
          { name: 'Toronto', tag: 'Service hub', lon: -79.4, lat: 43.7 }
        ]
      },
      {
        name: 'Europe', short: 'EU',
        text: 'EU-certified bikes shipped from Rotterdam, serviced by a growing dealer network.',
        stats: [['1', 'Warehouse'], ['180+', 'Dealers'], ['4–7 d', 'Delivery']],
        pins: [
          { name: 'Rotterdam', tag: 'Warehouse', lon: 4.5, lat: 51.9 },
          { name: 'Frankfurt', tag: 'Service hub', lon: 8.7, lat: 50.1 },
          { name: 'Paris', tag: 'Showroom', lon: 2.35, lat: 48.85 },
          { name: 'London', tag: 'Showroom', lon: -0.1, lat: 51.5 }
        ]
      },
      {
        name: 'Oceania', short: 'OC',
        text: 'Built for long Aussie roads, with local stock and support on the east coast.',
        stats: [['1', 'Warehouse'], ['60+', 'Dealers'], ['3–6 d', 'Delivery']],
        pins: [
          { name: 'Sydney', tag: 'Warehouse', lon: 151.2, lat: -33.9 },
          { name: 'Melbourne', tag: 'Showroom', lon: 144.9, lat: -37.8 },
          { name: 'Auckland', tag: 'Service hub', lon: 174.8, lat: -36.8 }
        ]
      },
      {
        name: 'Asia', short: 'AS',
        text: 'Where every TESWAY is designed, tested and built before it heads out.',
        stats: [['1', 'Factory'], ['90+', 'Dealers'], ['2–5 d', 'Delivery']],
        pins: [
          { name: 'Tokyo', tag: 'Showroom', lon: 139.7, lat: 35.7 },
          { name: 'Singapore', tag: 'Service hub', lon: 103.8, lat: 1.35 }
        ]
      }
    ]
  },
  time: [
    { year: '2016', title: 'A garage in Shenzhen', text: 'Three engineers and one fat-tire prototype set out to build an ebike that never quits.', img: 'Images/story-camp.jpg' },
    { year: '2018', title: 'First bike ships', text: 'Our first production model rolls out and sells out in its first month.', img: 'Images/story-delivery.jpg' },
    { year: '2020', title: 'Dual drive arrives', text: 'The X1 puts a motor in each wheel and redefines what a trail ebike can climb.', img: 'Images/hero-trail.jpg' },
    { year: '2022', title: 'Hello, Europe', text: 'A Rotterdam warehouse and EU-certified range bring TESWAY to 20+ countries.', img: 'Images/scenes/scene-fishing.jpg' },
    { year: '2024', title: '100,000 riders', text: 'Families, farmers and commuters cross the six-figure mark together.', img: 'Images/story-family.jpg' },
    { year: '2026', title: 'Going further', text: '40+ countries, 160 km range and a new lab for the next decade of riding.', img: 'Images/hero-desktop.jpg' }
  ],
  craft: {
    img: 'Images/hot/bike-dual.webp',
    stats: [
      { value: 3000, unit: 'W', label: 'Peak power' },
      { value: 190, unit: 'N·m', label: 'Max torque' },
      { value: 34, unit: 'MPH', label: 'Max speed' }
    ],
    points: [
      { title: 'Advanced Engineering', x: 36.5, y: 24, text: 'We use advanced 3D design technology to streamline frame development, ensuring precision from sketch to final product.' },
      { title: 'Hydroforming', x: 52, y: 33.5, text: 'Hydroforming shapes aluminum tubes by injecting heated oil under high pressure into a 3D mold, creating lightweight, high-stiffness parts without strength loss.' },
      { title: 'Special Tube Geometry', x: 45, y: 47, text: 'Engineers and designers collaborate to ensure optimal strength and a striking design that reflects the bike\'s character.' },
      { title: 'CNC Welding', x: 61, y: 38.5, text: 'Robotic welding ensures flawless, uniform, and high-strength welds, eliminating human errors.' }
    ]
  },
  voice: {
    score: 4.8,
    count: '12,400+',
    sources: ['Trustpilot', 'Google', 'Amazon'],
    reviews: [
      { name: 'Jason M.', from: 'Denver, US', bike: 'X1 Dual-Drive', title: 'Climbs like a goat', text: 'Took it up a gravel pass my old ebike could not touch. Two motors make all the difference.' },
      { name: 'Sophie L.', from: 'Lyon, FR', bike: 'X1 Family', title: 'School run, solved', text: 'Two kids, groceries and a hill every morning. I have not taken the car out in three months.' },
      { name: 'Ben K.', from: 'Brisbane, AU', bike: 'Trail Pro', title: 'Range is real', text: 'Did 138 km on one charge along the coast and still had a bar left. Not marketing, real numbers.' },
      { name: 'Hannah W.', from: 'Munich, DE', bike: 'X1 City', title: 'Feels premium', text: 'The welds are clean, the paint is tough and it rides quiet. Better finish than bikes twice the price.' },
      { name: 'Carlos R.', from: 'Austin, US', bike: 'X1 Cargo', title: 'My delivery partner', text: 'Ten-hour shifts, rain or shine. The cargo rack and battery have never let me down.' },
      { name: 'Emily T.', from: 'Toronto, CA', bike: 'Trail Pro', title: 'Support that cares', text: 'Had a question about the display at 9 pm and got a video call answer in minutes. Impressive.' },
      { name: 'Liam O.', from: 'Auckland, NZ', bike: 'X1 Dual-Drive', title: 'Snow? No problem', text: 'Fat tires and dual drive got me through a winter I thought would park the bike for months.' },
      { name: 'Mia S.', from: 'London, UK', bike: 'X1 City', title: 'Commute is fun again', text: 'Twenty minutes faster than the tube and I actually look forward to riding into work.' }
    ]
  }
};
