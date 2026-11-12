import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AppError } from '../utils/appError.js';
import { memoryStore } from '../data/memoryStore.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = memoryStore.findUserById(decoded.id);

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Attach user (excluding password) to request
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired authentication token.', 401));
  }
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = memoryStore.findUserById(decoded.id);
    if (user) {
      const { password, ...safeUser } = user;
      req.user = safeUser;
    }
  } catch (err) {
    // Ignore invalid token in optionalAuth
  }
  next();
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('You are not authenticated.', 401));
    }

    const normalizedUserRole = (req.user.role || 'traveler').toLowerCase();
    const normalizedAllowedRoles = roles.map(r => r.toLowerCase());

    // 'admin' role always has full access
    if (normalizedUserRole === 'admin') {
      return next();
    }

    // Host can access host routes
    if (normalizedAllowedRoles.includes(normalizedUserRole)) {
      return next();
    }

    // Check for 'Traveler & Host' combined role strings
    if (normalizedUserRole.includes('host') && normalizedAllowedRoles.includes('host')) {
      return next();
    }

    return next(new AppError('You do not have permission to perform this action.', 403));
  };
};

export default { protect, optionalAuth, authorize };
