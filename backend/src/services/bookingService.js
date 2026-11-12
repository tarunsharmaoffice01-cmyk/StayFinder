import { memoryStore } from '../data/memoryStore.js';
import { AppError } from '../utils/appError.js';

export const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, nights);
};

export const createBooking = async (data, user) => {
  const property = memoryStore.findListingById(data.propertyId);
  if (!property) {
    throw new AppError(`Property with id '${data.propertyId}' not found.`, 404);
  }

  const requestedGuests = Number(data.guests || 1);
  if (property.guests && requestedGuests > property.guests) {
    throw new AppError(`Maximum guest capacity for this property is ${property.guests}.`, 400);
  }

  const nights = data.nights || calculateNights(data.checkIn, data.checkOut);
  const pricePerNight = property.price;
  const subtotal = data.subtotal !== undefined ? Number(data.subtotal) : pricePerNight * nights;
  const cleaningFee = data.cleaningFee !== undefined ? Number(data.cleaningFee) : (property.cleaningFee || 60);
  const serviceFee = data.serviceFee !== undefined ? Number(data.serviceFee) : Math.round(subtotal * 0.12);
  const occupancyTaxes = data.occupancyTaxes !== undefined ? Number(data.occupancyTaxes) : Math.round(subtotal * 0.08);
  const total = data.total !== undefined ? Number(data.total) : (subtotal + cleaningFee + serviceFee + occupancyTaxes);

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newBooking = {
    id: `SF-2026-${randomSuffix}`,
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
    userId: user ? user.id : 'usr-student-01',
    propertyId: property.id,
    propertyTitle: property.title,
    propertyLocation: property.location,
    propertyImage: (property.images && property.images[0]) || property.imageUrl || '',
    propertyType: property.propertyType,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    nights,
    guests: requestedGuests,
    pricePerNight,
    subtotal,
    cleaningFee,
    serviceFee,
    occupancyTaxes,
    total,
    guestName: data.guestName || (user ? user.name : 'Guest Traveler'),
    guestEmail: data.guestEmail || (user ? user.email : 'traveler@stayfinder.edu'),
    hostName: property.hostName || 'StayFinder Host'
  };

  return memoryStore.createBooking(newBooking);
};

export const getUserBookings = async (userId, userEmail) => {
  return memoryStore.getBookingsByUser(userId, userEmail);
};

export const getBookingById = async (bookingId, userId, userRole) => {
  const booking = memoryStore.findBookingById(bookingId);
  if (!booking) {
    throw new AppError(`Booking with id '${bookingId}' not found.`, 404);
  }

  const isOwner = !userId || booking.userId === userId || (userRole && userRole.toLowerCase() === 'admin');
  if (!isOwner) {
    throw new AppError('You do not have permission to view this booking.', 403);
  }

  return booking;
};

export const cancelBooking = async (bookingId, userId, userRole) => {
  const booking = memoryStore.findBookingById(bookingId);
  if (!booking) {
    throw new AppError(`Booking with id '${bookingId}' not found.`, 404);
  }

  const isOwner = !userId || booking.userId === userId || (userRole && userRole.toLowerCase() === 'admin');
  if (!isOwner) {
    throw new AppError('You do not have permission to cancel this booking.', 403);
  }

  const updated = memoryStore.updateBooking(bookingId, {
    status: 'Cancelled',
    cancelledAt: new Date().toISOString()
  });

  return updated;
};

export default {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
};
