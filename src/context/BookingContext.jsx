import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { user, authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');

  const loadBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setBookingsError('');
      return;
    }

    setBookingsLoading(true);
    setBookingsError('');
    try {
      const result = await apiClient.get('/bookings');
      setBookings(result.data);
    } catch (error) {
      setBookingsError(error.message || 'Unable to load bookings.');
    } finally {
      setBookingsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) loadBookings();
  }, [authLoading, loadBookings]);

  const createBooking = useCallback(async (bookingDetails) => {
    const result = await apiClient.post('/bookings', bookingDetails);
    setBookings((previous) => [result.data, ...previous]);
    return result.data;
  }, []);

  const cancelBooking = useCallback(async (bookingId) => {
    const result = await apiClient.patch(
      `/bookings/${encodeURIComponent(bookingId)}/cancel`,
      {}
    );
    setBookings((previous) =>
      previous.map((booking) => booking.id === bookingId ? result.data : booking)
    );
    return result.data;
  }, []);

  const value = {
    bookings,
    bookingsCount: bookings.filter((booking) => booking.status !== 'Cancelled').length,
    bookingsLoading,
    bookingsError,
    refreshBookings: loadBookings,
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
