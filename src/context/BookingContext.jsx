import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BookingContext = createContext();

const BOOKINGS_STORAGE_KEY = 'stayfinder_bookings_v1';

const INITIAL_DEMO_BOOKINGS = [
  {
    id: 'SF-2026-8941',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
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

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_BOOKINGS;
    } catch (e) {
      console.error('Failed to parse bookings from localStorage', e);
      return INITIAL_DEMO_BOOKINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings', e);
    }
  }, [bookings]);

  /**
   * Generates a new confirmed booking record
   */
  const createBooking = useCallback((bookingDetails) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: `SF-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      ...bookingDetails
    };

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  }, []);

  /**
   * Cancels a booking
   */
  const cancelBooking = useCallback((bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  }, []);

  const value = {
    bookings,
    bookingsCount: bookings.length,
    createBooking,
    cancelBooking
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;

