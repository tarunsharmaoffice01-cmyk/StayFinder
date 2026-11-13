
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/appError.js';

const mapBooking = (b) => ({
  id: b.id,
  userId: b.user_id,
  propertyId: b.property_id,
  propertyTitle: b.property_title,
  propertyLocation: b.property_location,
  propertyImage: b.property_image,
  propertyType: b.property_type,
  checkIn: b.check_in,
  checkOut: b.check_out,
  nights: b.nights,
  guests: b.guests,
  pricePerNight: Number(b.price_per_night),
  subtotal: Number(b.subtotal),
  cleaningFee: Number(b.cleaning_fee),
  serviceFee: Number(b.service_fee),
  occupancyTaxes: Number(b.occupancy_taxes),
  total: Number(b.total),
  status: b.status,
  guestName: b.guest_name,
  guestEmail: b.guest_email,
  hostName: b.host_name,
  createdAt: b.created_at,
  cancelledAt: b.cancelled_at
});

export const calculateNights = (checkIn, checkOut) => {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);

  if (!Number.isFinite(start.getTime()) ||
      !Number.isFinite(end.getTime()) || end <= start) {
    throw new AppError('Please provide valid check-in and check-out dates.', 400);
  }

  return Math.round((end - start) / 86400000);
};

export const createBooking = async (data, user) => {
  if (!user?.id) throw new AppError('Please login to make a booking.', 401);

  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', data.propertyId)
    .maybeSingle();

  if (propertyError) throw new AppError('Unable to load property.', 500);
  if (!property) throw new AppError('Property not found.', 404);

  const nights = calculateNights(data.checkIn, data.checkOut);
  const guests = Number(data.guests || 1);

  if (!Number.isInteger(guests) || guests < 1) {
    throw new AppError('Please enter a valid number of guests.', 400);
  }

  if (property.guests && guests > Number(property.guests)) {
    throw new AppError(`Maximum guest capacity is ${property.guests}.`, 400);
  }

  const pricePerNight = Number(property.price);
  if (!Number.isFinite(pricePerNight) || pricePerNight < 0) {
    throw new AppError('Invalid property price.', 400);
  }

  const subtotal = pricePerNight * nights;
  const cleaningFee = Number(property.cleaning_fee || 0);
  const serviceFee = Math.round(subtotal * 0.12);
  const occupancyTaxes = Math.round(subtotal * 0.08);
  const total = subtotal + cleaningFee + serviceFee + occupancyTaxes;
  const images = Array.isArray(property.images) ? property.images : [];

  const newBooking = {
    id: `SF-${Date.now()}`,
    user_id: user.id,
    property_id: property.id,
    property_title: property.title,
    property_location: property.location,
    property_image: images[0] || '',
    property_type: property.property_type,
    check_in: data.checkIn,
    check_out: data.checkOut,
    nights,
    guests,
    price_per_night: pricePerNight,
    subtotal,
    cleaning_fee: cleaningFee,
    service_fee: serviceFee,
    occupancy_taxes: occupancyTaxes,
    total,
    status: 'Confirmed',
    guest_name: user.name,
    guest_email: user.email,
    host_name: property.host_name || 'StayFinder Host'
  };

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert(newBooking)
    .select('*')
    .single();

  if (error) throw new AppError('Unable to create booking.', 500);
  return mapBooking(booking);
};

export const getUserBookings = async (userId) => {
  if (!userId) throw new AppError('Please login first.', 401);

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new AppError('Unable to load bookings.', 500);
  return (data || []).map(mapBooking);
};

export const getBookingById = async (bookingId, userId, userRole) => {
  if (!userId) throw new AppError('Please login first.', 401);

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .maybeSingle();

  if (error) throw new AppError('Unable to load booking.', 500);
  if (!data) throw new AppError('Booking not found.', 404);

  if (data.user_id !== userId && userRole?.toLowerCase() !== 'admin') {
    throw new AppError('You do not have permission to view this booking.', 403);
  }

  return mapBooking(data);
};

export const cancelBooking = async (bookingId, userId, userRole) => {
  if (!userId) throw new AppError('Please login first.', 401);

  const { data: booking, error: findError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .maybeSingle();

  if (findError) throw new AppError('Unable to load booking.', 500);
  if (!booking) throw new AppError('Booking not found.', 404);

  if (booking.user_id !== userId && userRole?.toLowerCase() !== 'admin') {
    throw new AppError('You do not have permission to cancel this booking.', 403);
  }

  if (booking.status === 'Cancelled') {
    throw new AppError('This booking is already cancelled.', 400);
  }

  const now = new Date().toISOString();

  const { data: updated, error } = await supabase
    .from('bookings')
    .update({
      status: 'Cancelled',
      cancelled_at: now,
      updated_at: now
    })
    .eq('id', bookingId)
    .select('*')
    .single();

  if (error) throw new AppError('Unable to cancel booking.', 500);
  return mapBooking(updated);
};

export default {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
};
