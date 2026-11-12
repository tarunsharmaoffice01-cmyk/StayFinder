export const INITIAL_BOOKINGS = [
  {
    id: 'SF-2026-8941',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    userId: 'usr-student-01',
    propertyId: 'sf-101',
    propertyTitle: 'The Glass Alpine Chalet with Matterhorn Views',
    propertyLocation: 'Zermatt, Valais, Switzerland',
    propertyImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80',
    propertyType: 'Chalet',
    checkIn: '2026-12-20',
    checkOut: '2026-12-24',
    nights: 4,
    guests: 4,
    pricePerNight: 380,
    subtotal: 1520,
    cleaningFee: 75,
    serviceFee: 182,
    occupancyTaxes: 122,
    total: 1899,
    status: 'Confirmed',
    guestName: 'Alex Rivera',
    guestEmail: 'alex.rivera@stayfinder.edu',
    hostName: 'Beat & Marianne'
  }
];

export default INITIAL_BOOKINGS;
