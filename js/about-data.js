/* ==== about-data.js ==== */
window.TESWAY_ABOUT = {
  map: {
    hq: { name: 'Shenzhen HQ', tag: 'R&D · Factory', lon: 114.1, lat: 22.5 },
    regions: [
      {
        name: 'North America', label: 'United States',
        meta: '2 warehouses · 320+ dealers · 3–5 day delivery',
        pins: [
          { name: 'Los Angeles', lon: -118.2, lat: 34, big: 1 },
          { name: 'New Jersey', lon: -74.2, lat: 40.7, big: 1 },
          { name: 'Toronto', lon: -79.4, lat: 43.7 }
        ]
      },
      {
        name: 'Europe', label: 'Germany',
        meta: '1 warehouse · 180+ dealers · 4–7 day delivery',
        pins: [
          { name: 'Rotterdam', lon: 4.5, lat: 51.9, big: 1 },
          { name: 'Frankfurt', lon: 8.7, lat: 50.1 },
          { name: 'Paris', lon: 2.35, lat: 48.85 },
          { name: 'London', lon: -0.1, lat: 51.5 }
        ]
      },
      {
        name: 'Oceania', label: 'Australia',
        meta: '1 warehouse · 60+ dealers · 3–6 day delivery',
        pins: [
          { name: 'Sydney', lon: 151.2, lat: -33.9, big: 1 },
          { name: 'Melbourne', lon: 144.9, lat: -37.8 },
          { name: 'Auckland', lon: 174.8, lat: -36.8 }
        ]
      },
      {
        name: 'Asia', label: 'Japan',
        meta: '1 factory · 90+ dealers · 2–5 day delivery',
        pins: [
          { name: 'Tokyo', lon: 139.7, lat: 35.7, big: 1 },
          { name: 'Singapore', lon: 103.8, lat: 1.35 }
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
    { year: '2026', title: 'Going further', text: '40+ countries, 160 km range and a new lab for the next decade of riding.', img: 'Images/brand-beyond.jpg' }
  ],
  craft: {
    img: 'Images/hot/bike-dual.webp',
    stats: [
      { value: 3000, unit: 'W', label: 'Peak power' },
      { value: 190, unit: 'N·m', label: 'Max torque' },
      { value: 34, unit: 'MPH', label: 'Max speed' }
    ],
    points: [
      { title: 'Advanced Engineering', chip: '3D CAD · FEA', x: 50, y: 50, z: 1, text: 'We use advanced 3D design technology to streamline frame development, ensuring precision from sketch to final product.' },
      { title: 'Hydroforming', chip: '1,200 bar', x: 52, y: 33, z: 2.4, text: 'Hydroforming shapes aluminum tubes by injecting heated oil under high pressure into a 3D mold, creating lightweight, high-stiffness parts without strength loss.' },
      { title: 'Special Tube Geometry', chip: '6061-T6 alloy', x: 45, y: 47, z: 2.2, text: 'Engineers and designers collaborate to ensure optimal strength and a striking design that reflects the bike\'s character.' },
      { title: 'CNC Welding', chip: '6-axis robot', x: 61, y: 39, z: 2.8, text: 'Robotic welding ensures flawless, uniform, and high-strength welds, eliminating human errors.' }
    ]
  },
  voice: {
    score: 4.8,
    count: '12,400+',
    sources: ['Trustpilot', 'Google', 'Amazon'],
    reviews: [
      { name: 'Jason M.', from: 'Denver, US', bike: 'X1 Dual-Drive', img: 'Images/hero-trail.jpg', title: 'Climbs like a goat', text: 'Took it up a gravel pass my old ebike could not touch. Two motors make all the difference.' },
      { name: 'Sophie L.', from: 'Lyon, FR', bike: 'X1 Family', img: 'Images/story-family.jpg', title: 'School run, solved', text: 'Two kids, groceries and a hill every morning. I have not taken the car out in three months.' },
      { name: 'Ben K.', from: 'Brisbane, AU', bike: 'Trail Pro', img: 'Images/story-camp.jpg', title: 'Range is real', text: 'Did 138 km on one charge along the coast and still had a bar left. Not marketing, real numbers.' },
      { name: 'Hannah W.', from: 'Munich, DE', bike: 'X1 City', img: 'Images/bike-city.jpg', title: 'Feels premium', text: 'The welds are clean, the paint is tough and it rides quiet. Better finish than bikes twice the price.' },
      { name: 'Carlos R.', from: 'Austin, US', bike: 'X1 Cargo', img: 'Images/story-delivery.jpg', title: 'My delivery partner', text: 'Ten-hour shifts, rain or shine. The cargo rack and battery have never let me down.' },
      { name: 'Emily T.', from: 'Toronto, CA', bike: 'Trail Pro', img: 'Images/scenes/scene-fishing.jpg', title: 'Support that cares', text: 'Had a question about the display at 9 pm and got a video call answer in minutes. Impressive.' },
      { name: 'Liam O.', from: 'Auckland, NZ', bike: 'X1 Dual-Drive', img: 'Images/scenes/scene-hunting.jpg', title: 'Snow? No problem', text: 'Fat tires and dual drive got me through a winter I thought would park the bike for months.' },
      { name: 'Mia S.', from: 'London, UK', bike: 'X1 Family', img: 'Images/hero-family.jpg', title: 'Weekend rides again', text: 'We pack a picnic, load the kids and just go. It has become our favourite family ritual.' },
      { name: 'Noah P.', from: 'Iowa, US', bike: 'X1 Cargo', img: 'Images/scenes/scene-farm.jpg', title: 'Farm workhorse', text: 'Fence checks, feed runs and muddy tracks every day. Tougher than the quad and way quieter.' },
      { name: 'Ava D.', from: 'Vancouver, CA', bike: 'Trail Pro', img: 'Images/brand-beyond.jpg', title: 'Sunrise chaser', text: 'Ridden to the lookout before dawn more times than I can count. It never skips a beat.' }
    ]
  }
};
