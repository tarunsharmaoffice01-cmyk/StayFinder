import bookingService from '../services/bookingService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body, req.user);
  res.status(201).json({
    success: true,
    message: 'Reservation confirmed successfully',
    data: booking
  });
});

export const getUserBookings = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const userEmail = req.user ? req.user.email : null;
  const bookings = await bookingService.getUserBookings(userId, userEmail);
  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const userRole = req.user ? req.user.role : null;
  const booking = await bookingService.getBookingById(req.params.id, userId, userRole);
  res.status(200).json({
    success: true,
    data: booking
  });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const userRole = req.user ? req.user.role : null;
  const updatedBooking = await bookingService.cancelBooking(req.params.id, userId, userRole);
  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: updatedBooking
  });
});

export default {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
};
