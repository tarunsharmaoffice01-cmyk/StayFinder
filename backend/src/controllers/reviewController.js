import reviewService from '../services/reviewService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getPropertyReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getPropertyReviews(req.params.id);
  res.status(200).json({
    success: true,
    count: result.reviews.length,
    overallRating: result.overallRating,
    reviewCount: result.reviewCount,
    metrics: result.metrics,
    data: result.reviews
  });
});

export const addReview = asyncHandler(async (req, res) => {
  const result = await reviewService.addReview(req.params.id, req.body, req.user);
  res.status(201).json({
    success: true,
    message: 'Review posted successfully',
    data: result.review,
    updatedProperty: result.updatedProperty
  });
});

export default {
  getPropertyReviews,
  addReview
};
