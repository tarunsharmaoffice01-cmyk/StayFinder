import {
  createBooking as insertBooking,
  getBookingById as selectBookingById,
  getBookingsByUser,
  getPropertyById,
  updateBooking
} from '../../db/index.js';
import { AppError } from '../utils/appError.js';
import { unwrapDbResult } from '../utils/unwrapDbResult.js';

export const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, nights);
};

export const createBooking = async (data, user) => {
  const property = unwrapDbResult(
    await getPropertyById(data.propertyId),
    'loading property for booking'
  );
  if (!property) {
    throw new AppError(`Property with id '${data.propertyId}' not found.`, 404);
  }

  const requestedGuests = Number(data.guests || 1);
  if (property.guests && requestedGuests > property.guests) {
    throw new AppError(`Maximum guest capacity for this property is ${property.guests}.`, 400);
  }

  const nights = calculateNights(data.checkIn, data.checkOut);
  const pricePerNight = property.price;
  const subtotal = pricePerNight * nights;
  const cleaningFee = property.cleaningFee || 60;
  const serviceFee = Math.round(subtotal * 0.12);
  const occupancyTaxes = Math.round(subtotal * 0.08);
  const total = subtotal + cleaningFee + serviceFee + occupancyTaxes;

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newBooking = {
    id: `SF-2026-${randomSuffix}`,
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
    userId: user.id,
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
    guestName: data.guestName || user.name,
    guestEmail: data.guestEmail || user.email,
    hostName: property.hostName || 'StayFinder Host'
  };

  return unwrapDbResult(await insertBooking(newBooking), 'creating booking');
};

export const getUserBookings = async (userId, userEmail) => {
  return unwrapDbResult(
    await getBookingsByUser(userId, userEmail),
    'loading user bookings'
  );
};

export const getBookingById = async (bookingId, userId, userRole) => {
  const booking = unwrapDbResult(
    await selectBookingById(bookingId),
    'loading booking'
  );
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
  const booking = unwrapDbResult(
    await selectBookingById(bookingId),
    'loading booking'
  );
  if (!booking) {
    throw new AppError(`Booking with id '${bookingId}' not found.`, 404);
  }

  const isOwner = !userId || booking.userId === userId || (userRole && userRole.toLowerCase() === 'admin');
  if (!isOwner) {
    throw new AppError('You do not have permission to cancel this booking.', 403);
  }

  const updated = unwrapDbResult(await updateBooking(bookingId, {
    status: 'Cancelled',
    cancelledAt: new Date().toISOString()
  }), 'cancelling booking');

  return updated;
};

export default {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
};
