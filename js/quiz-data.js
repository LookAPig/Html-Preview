window.TESWAY_QUIZ = {
  banner: {
    label: 'Question',
    scenes: ['Images/hero-desktop.jpg', 'Images/brand-beyond.jpg', 'Images/hero-trail.jpg', 'Images/story-delivery.jpg'],
    cta: 'Find my ride',
    meta: '{n} questions · about 60 seconds'
  },
  questions: [
    {
      q: 'What will you mainly use it for?',
      options: [
        { label: 'City commute', hint: 'Quiet daily rides' },
        { label: 'Trail & off-road', hint: 'Climb and gravel' },
        { label: 'Family & kids', hint: 'Weekend runs' },
        { label: 'Cargo & delivery', hint: 'Haul more per charge' }
      ]
    },
    {
      q: 'How far do you ride most days?',
      options: [
        { label: 'Under 20 km', hint: 'Short hops' },
        { label: '20–60 km', hint: 'Daily range' },
        { label: '60–120 km', hint: 'Longer loops' },
        { label: '120 km+', hint: 'Touring days' }
      ]
    },
    {
      q: 'What terrain do you hit most?',
      options: [
        { label: 'Paved city roads', hint: 'Smooth & quick' },
        { label: 'Mixed gravel', hint: 'Path to trail' },
        { label: 'Steep dirt trails', hint: 'Serious climb' },
        { label: 'Farm & ranch roads', hint: 'Dirt all day' }
      ]
    },
    {
      q: 'Do you need extra capacity?',
      options: [
        { label: 'Just me', hint: 'Light & nimble' },
        { label: 'A child seat', hint: 'Family ready' },
        { label: 'A cargo rack', hint: 'Gear & groceries' },
        { label: 'Heavy payload', hint: '50 kg+ loads' }
      ]
    }
  ],
  email: {
    title: 'Your match is ready',
    sub: 'Leave your email and we will send a shortlist with the right TESWAY for your ride.',
    placeholder: 'Your email',
    submit: 'Get my match',
    err: 'Please enter a valid email.'
  },
  done: {
    title: 'You are on the list',
    sub: 'Your personal TESWAY match is on its way. Check your inbox in a few minutes.',
    btn: 'Back to bikes'
  }
};
