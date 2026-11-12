import { AppError } from '../utils/appError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Full name is required.');
  }

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed: ' + errors.join(' '), 400, errors));
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push('Email is required.');
  }

  if (!password) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed: ' + errors.join(' '), 400, errors));
  }

  next();
};

export const validateUpdateProfile = (req, res, next) => {
  const { email, name, phone } = req.body;
  const errors = [];

  if (email && !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (name !== undefined && (!name || !name.trim())) {
    errors.push('Name cannot be empty.');
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed: ' + errors.join(' '), 400, errors));
  }

  next();
};

export const validateCreateListing = (req, res, next) => {
  const { title, location, country, price, propertyType, category, guests, description } = req.body;
  const errors = [];

  if (!title || !title.trim()) errors.push('Listing title is required.');
  if (!location || !location.trim()) errors.push('Location is required.');
  if (!country || !country.trim()) errors.push('Country is required.');
  if (price === undefined || isNaN(price) || Number(price) <= 0) errors.push('Price must be a positive number.');
  if (!propertyType || !propertyType.trim()) errors.push('Property type is required.');
  if (!category || !category.trim()) errors.push('Category is required.');
  if (guests === undefined || isNaN(guests) || Number(guests) < 1) errors.push('Guests capacity must be at least 1.');
  if (!description || !description.trim()) errors.push('Property description is required.');

  if (errors.length > 0) {
    return next(new AppError('Validation failed: ' + errors.join(' '), 400, errors));
  }

  next();
};

export const validateCreateBooking = (req, res, next) => {
  const { propertyId, checkIn, checkOut, guests, guestEmail } = req.body;
  const errors = [];

  if (!propertyId) errors.push('Property ID is required.');
  if (!checkIn) errors.push('Check-in date is required.');
  if (!checkOut) errors.push('Check-out date is required.');

  if (checkIn && checkOut) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
      errors.push('Invalid date format for check-in or check-out.');
    } else if (outDate <= inDate) {
      errors.push('Check-out date must be after check-in date.');
    }
  }

  if (guests !== undefined && (isNaN(guests) || Number(guests) < 1)) {
    errors.push('Number of guests must be at least 1.');
  }

  if (guestEmail && !EMAIL_REGEX.test(guestEmail.trim())) {
    errors.push('Valid guest email is required.');
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed: ' + errors.join(' '), 400, errors));
  }

  next();
};

export const validateCreateReview = (req, res, next) => {
  const { rating, text } = req.body;
  const errors = [];

  if (rating === undefined || isNaN(rating) || Number(rating) < 1 || Number(rating) > 5) {
    errors.push('Rating must be a number between 1 and 5.');
  }

  if (!text || typeof text !== 'string' || !text.trim()) {
    errors.push('Review text is required.');
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed: ' + errors.join(' '), 400, errors));
  }

  next();
};

export default {
  validateSignup,
  validateLogin,
  validateUpdateProfile,
  validateCreateListing,
  validateCreateBooking,
  validateCreateReview
};
