import {
  deleteProperty,
  getBookingById,
  getBookings,
  getProperties,
  getPropertyById,
  getUsers,
  updateBooking
} from '../../db/index.js';
import { AppError } from '../utils/appError.js';
import { unwrapDbResult } from '../utils/unwrapDbResult.js';

export const getPlatformStats = async () => {
  const [listingsResult, bookingsResult, usersResult] = await Promise.all([
    getProperties(),
    getBookings(),
    getUsers()
  ]);
  const listings = unwrapDbResult(listingsResult, 'loading properties for admin stats');
  const bookings = unwrapDbResult(bookingsResult, 'loading bookings for admin stats');
  const users = unwrapDbResult(usersResult, 'loading users for admin stats');

  const totalRevenue = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const bookingsByStatus = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const listingsByCategory = listings.reduce((acc, l) => {
    const cat = l.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return {
    overview: {
      totalListings: listings.length,
      totalBookings: bookings.length,
      totalUsers: users.length,
      totalRevenue
    },
    bookingsByStatus,
    listingsByCategory
  };
};

export const getAllListings = async () => {
  return unwrapDbResult(await getProperties(), 'loading admin properties');
};

export const deleteListingByAdmin = async (id) => {
  const listing = unwrapDbResult(await getPropertyById(id), 'loading property');
  if (!listing) {
    throw new AppError(`Listing with id '${id}' not found.`, 404);
  }
  unwrapDbResult(await deleteProperty(id), 'deleting property');
  return { success: true, id, message: 'Listing permanently removed by admin.' };
};

export const getAllBookings = async () => {
  return unwrapDbResult(await getBookings(), 'loading admin bookings');
};

export const updateBookingStatus = async (id, status) => {
  const validStatuses = ['Confirmed', 'Cancelled', 'Completed', 'Pending'];
  if (!validStatuses.includes(status)) {
    throw new AppError(`Invalid status. Allowed values: ${validStatuses.join(', ')}`, 400);
  }

  const booking = unwrapDbResult(await getBookingById(id), 'loading booking');
  if (!booking) {
    throw new AppError(`Booking with id '${id}' not found.`, 404);
  }

  const updated = unwrapDbResult(
    await updateBooking(id, { status, updatedAt: new Date().toISOString() }),
    'updating booking status'
  );
  return updated;
};

export default {
  getPlatformStats,
  getAllListings,
  deleteListingByAdmin,
  getAllBookings,
  updateBookingStatus
};
