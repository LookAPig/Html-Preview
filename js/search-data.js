window.TESWAY_SEARCH = {
  hints: ['long range', 'bike for kids', 'cargo bike', 'steep hills', 'spare battery'],
  trending: ['X1 Dual-Drive', 'Black Friday deals', 'Long range', 'Family bike', 'Cargo', 'Test ride'],
  picks: ['dual', 'trail', 'family', 'cargo'],
  specs: {
    dual: '160 km range · 120 N·m',
    trail: '140 km range · 30° climb',
    family: '150 kg payload · low step',
    cargo: '50 kg rack · 160 km range'
  },
  intents: [
    { keys: ['range', 'long', 'far', 'tour', 'commut', 'distance', 'battery life'], id: 'dual', why: 'Up to 160 km on a single charge' },
    { keys: ['hill', 'climb', 'steep', 'mountain', 'trail', 'off-road', 'offroad', 'hunt'], id: 'trail', why: 'Full suspension and a 30° climb rating' },
    { keys: ['kid', 'child', 'family', 'school', 'seat', 'mom', 'dad'], id: 'family', why: 'Child seat ready with a low step-through frame' },
    { keys: ['cargo', 'deliver', 'haul', 'carry', 'load', 'camp', 'farm'], id: 'cargo', why: '50 kg rear rack, built to haul all day' },
    { keys: ['dual', 'motor', 'power', 'fast', 'torque', 'fish'], id: 'dual', why: 'Two motors and 120 N·m of torque' }
  ],
  help: [
    { title: 'Shipping & delivery times', keys: 'shipping delivery order track', href: '#foot' },
    { title: 'Returns within 30 days', keys: 'return refund exchange', href: '#foot' },
    { title: '2-year warranty coverage', keys: 'warranty repair broken', href: '#foot' },
    { title: 'Book a free test ride', keys: 'test ride dealer store try', href: '#top' },
    { title: 'Battery care & charging', keys: 'battery charge charging care winter', href: '#blog' },
    { title: 'Financing from 0% APR', keys: 'finance pay monthly klarna installment', href: '#foot' }
  ],
  text: {
    placeholder: 'Search bikes, gear, rides…',
    trending: 'Trending searches',
    recent: 'Recent searches',
    clear: 'Clear',
    picks: 'Recommended for you',
    best: 'Best match for you',
    none: 'No results for',
    noneSub: 'Check the spelling or try one of these instead.',
    all: 'See all results'
  }
};
