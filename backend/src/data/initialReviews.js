export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    propertyId: 'sf-101',
    userId: 'usr-traveler-01',
    author: 'Sophie Dubois',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    date: 'October 2026',
    rating: 5,
    text: 'An absolute dream stay! The architecture and attention to detail exceeded every expectation. The views from the terrace were mesmerizing at sunrise. Our hosts were attentive, friendly, and gave phenomenal local recommendations.',
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString()
  },
  {
    id: 'rev-2',
    propertyId: 'sf-101',
    userId: 'usr-student-01',
    author: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    date: 'September 2026',
    rating: 5,
    text: 'Everything was pristine. The kitchen was stocked with high-end appliances, the beds were ultra-comfortable, and the sauna was incredible after long hiking days. We cannot wait to return next year.',
    createdAt: new Date(Date.now() - 86400000 * 50).toISOString()
  },
  {
    id: 'rev-3',
    propertyId: 'sf-101',
    userId: 'usr-student-01',
    author: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    date: 'August 2026',
    rating: 5,
    text: 'Pictures honestly do not do this place justice. It is peaceful, ultra-private, and the design touches make you feel instantly at home. Check-in was completely seamless.',
    createdAt: new Date(Date.now() - 86400000 * 80).toISOString()
  },
  {
    id: 'rev-4',
    propertyId: 'sf-101',
    userId: 'usr-traveler-01',
    author: 'David Lindqvist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    date: 'July 2026',
    rating: 4.9,
    text: 'A true 5-star experience. The host went above and beyond when our flight was delayed, greeting us personally and having warm bread and fresh coffee waiting for us.',
    createdAt: new Date(Date.now() - 86400000 * 110).toISOString()
  },
  {
    id: 'rev-5',
    propertyId: 'sf-102',
    userId: 'usr-student-01',
    author: 'Camille Laurent',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    date: 'September 2026',
    rating: 5,
    text: 'The infinity pool overlooking the Aegean caldera is beyond words. Watching the sunset from the terrace was the highlight of our entire Greece trip.',
    createdAt: new Date(Date.now() - 86400000 * 40).toISOString()
  }
];

export default INITIAL_REVIEWS;
