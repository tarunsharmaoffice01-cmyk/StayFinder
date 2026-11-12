import { memoryStore } from '../data/memoryStore.js';
import { AppError } from '../utils/appError.js';

export const getPlatformStats = async () => {
  const listings = memoryStore.getAllListings();
  const bookings = memoryStore.getAllBookings();
  const users = memoryStore.getAllUsers();

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
  return memoryStore.getAllListings();
};

export const deleteListingByAdmin = async (id) => {
  const listing = memoryStore.findListingById(id);
  if (!listing) {
    throw new AppError(`Listing with id '${id}' not found.`, 404);
  }
  memoryStore.deleteListing(id);
  return { success: true, id, message: 'Listing permanently removed by admin.' };
};

export const getAllBookings = async () => {
  return memoryStore.getAllBookings();
};

export const updateBookingStatus = async (id, status) => {
  const validStatuses = ['Confirmed', 'Cancelled', 'Completed', 'Pending'];
  if (!validStatuses.includes(status)) {
    throw new AppError(`Invalid status. Allowed values: ${validStatuses.join(', ')}`, 400);
  }

  const booking = memoryStore.findBookingById(id);
  if (!booking) {
    throw new AppError(`Booking with id '${id}' not found.`, 404);
  }

  const updated = memoryStore.updateBooking(id, { status, updatedAt: new Date().toISOString() });
  return updated;
};

export default {
  getPlatformStats,
  getAllListings,
  deleteListingByAdmin,
  getAllBookings,
  updateBookingStatus
};
