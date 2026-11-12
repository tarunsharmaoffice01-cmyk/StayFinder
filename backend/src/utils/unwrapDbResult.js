import { AppError } from './appError.js';

export const unwrapDbResult = ({ data, error }, operation) => {
  if (error) {
    throw new AppError(`Database error while ${operation}: ${error.message}`, 500);
  }

  return data;
};

export default unwrapDbResult;
