import { memoryStore } from '../data/memoryStore.js';
import { AppError } from '../utils/appError.js';

export const getPropertyReviews = async (propertyId) => {
  const property = memoryStore.findListingById(propertyId);
  if (!property) {
    throw new AppError(`Property with id '${propertyId}' not found.`, 404);
  }

  const reviews = memoryStore.getReviewsByProperty(propertyId);

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
  const property = memoryStore.findListingById(propertyId);
  if (!property) {
    throw new AppError(`Property with id '${propertyId}' not found.`, 404);
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    propertyId,
    userId: user ? user.id : 'usr-traveler-01',
    author: user ? user.name : (data.author || 'StayFinder Guest'),
    avatar: user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    rating: Number(data.rating),
    text: data.text.trim(),
    createdAt: new Date().toISOString()
  };

  memoryStore.addReview(newReview);

  // Recalculate average rating for property
  const allReviews = memoryStore.getReviewsByProperty(propertyId);
  const totalScore = allReviews.reduce((sum, r) => sum + r.rating, 0);
  const newRating = Number((totalScore / allReviews.length).toFixed(2));
  const newCount = allReviews.length;

  memoryStore.updateListing(propertyId, {
    rating: newRating,
    reviews: newCount
  });

  return {
    review: newReview,
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
