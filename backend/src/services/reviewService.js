import {
  createReview as insertReview,
  getProperties,
  getPropertyById,
  getReviewsByProperty,
  updateProperty
} from '../../db/index.js';
import { AppError } from '../utils/appError.js';
import { unwrapDbResult } from '../utils/unwrapDbResult.js';

export const getPropertyReviews = async (propertyId) => {
  const property = unwrapDbResult(
    await getPropertyById(propertyId),
    'loading property for reviews'
  );
  if (!property) {
    throw new AppError(`Property with id '${propertyId}' not found.`, 404);
  }

  const reviews = unwrapDbResult(
    await getReviewsByProperty(propertyId),
    'loading property reviews'
  );

  // Return standard metrics layout matching ReviewSection.jsx
  const baseRating = property.rating || 4.95;
  const metrics = [
    { label: 'Cleanliness', score: (baseRating - 0.05).toFixed(1), width: '98%' },
    { label: 'Accuracy', score: (baseRating - 0.06).toFixed(1), width: '98%' },
    { label: 'Communication', score: '5.0', width: '100%' },
    { label: 'Location', score: (baseRating - 0.07).toFixed(1), width: '97%' },
    { label: 'Check-in', score: '5.0', width: '100%' },
    { label: 'Value', score: (baseRating - 0.15).toFixed(1), width: '96%' }
  ];

  return {
    propertyId,
    overallRating: property.rating,
    reviewCount: property.reviews,
    metrics,
    reviews
  };
};

export const addReview = async (propertyId, data, user) => {
  const property = unwrapDbResult(
    await getPropertyById(propertyId),
    'loading property for review'
  );
  if (!property) {
    throw new AppError(`Property with id '${propertyId}' not found.`, 404);
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    propertyId,
    userId: user.id,
    author: user.name,
    avatar: user.avatar,
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    rating: Number(data.rating),
    text: data.text.trim(),
    createdAt: new Date().toISOString()
  };

  const savedReview = unwrapDbResult(await insertReview(newReview), 'creating review');

  // Recalculate average rating for property
  const allReviews = unwrapDbResult(
    await getReviewsByProperty(propertyId),
    'reloading property reviews'
  );
  const totalScore = allReviews.reduce((sum, r) => sum + r.rating, 0);
  const newRating = Number((totalScore / allReviews.length).toFixed(2));
  const newCount = allReviews.length;

  unwrapDbResult(
    await updateProperty(propertyId, { rating: newRating, reviews: newCount }),
    'updating property rating'
  );

  return {
    review: savedReview,
    updatedProperty: {
      id: propertyId,
      rating: newRating,
      reviews: newCount
    }
  };
};

export default {
  getPropertyReviews,
  addReview
};
