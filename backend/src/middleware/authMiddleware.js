import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AppError } from '../utils/appError.js';
import { getUserById } from '../../db/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { unwrapDbResult } from '../utils/unwrapDbResult.js';

const getAuthenticatedUser = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, config.JWT_SECRET);
  } catch {
    throw new AppError('Invalid or expired authentication token.', 401);
  }

  const user = unwrapDbResult(await getUserById(decoded.id), 'checking authenticated user');
  if (!user) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }
  return user;
};

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  req.user = await getAuthenticatedUser(token);
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

export default { protect, authorize };
