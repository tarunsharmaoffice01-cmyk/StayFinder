import { AppError } from '../utils/appError.js';
import { config } from '../config/env.js';

export const notFound = (req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl} - Endpoint not found`, 404));
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const response = {
    success: false,
    message: err.message || 'Internal Server Error'
  };

  if (err.errors && err.errors.length > 0) {
    response.errors = err.errors;
  }

  if (config.NODE_ENV === 'development' && !err.isOperational) {
    response.stack = err.stack;
  }

  res.status(err.statusCode).json(response);
};

export default { notFound, errorHandler };
