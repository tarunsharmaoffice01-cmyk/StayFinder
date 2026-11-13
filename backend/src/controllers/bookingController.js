
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
  const bookings = await bookingService.getUserBookings(req.user.id);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(
    req.params.id,
    req.user.id,
    req.user.role
  );

  res.status(200).json({ success: true, data: booking });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking(
    req.params.id,
    req.user.id,
    req.user.role
  );

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking
  });
});

export default {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
};
