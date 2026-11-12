import adminService from '../services/adminService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getPlatformStats();
  res.status(200).json({
    success: true,
    data: stats
  });
});

export const getAllListings = asyncHandler(async (req, res) => {
  const listings = await adminService.getAllListings();
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

export const deleteListing = asyncHandler(async (req, res) => {
  const result = await adminService.deleteListingByAdmin(req.params.id);
  res.status(200).json(result);
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await adminService.getAllBookings();
  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const updatedBooking = await adminService.updateBookingStatus(req.params.id, req.body.status);
  res.status(200).json({
    success: true,
    message: 'Booking status updated successfully',
    data: updatedBooking
  });
});

export default {
  getStats,
  getAllListings,
  deleteListing,
  getAllBookings,
  updateBookingStatus
};
