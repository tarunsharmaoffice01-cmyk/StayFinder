import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ReviewSection = ({
  propertyId,
  rating = 0,
  reviewCount = 0
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [overallRating, setOverallRating] = useState(rating);
  const [totalReviews, setTotalReviews] = useState(reviewCount);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [loading, setLoading] = useState(Boolean(propertyId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!propertyId) return undefined;
    let active = true;

    apiClient.get(`/listings/${encodeURIComponent(propertyId)}/reviews`)
      .then((result) => {
        if (!active) return;
        setReviews(result.data || []);
        setMetrics(result.metrics || []);
        setOverallRating(result.overallRating ?? rating);
        setTotalReviews(result.reviewCount ?? result.count ?? reviewCount);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Unable to load reviews.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [propertyId, rating, reviewCount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await apiClient.post(
        `/listings/${encodeURIComponent(propertyId)}/reviews`,
        { rating: reviewRating, text: reviewText }
      );
      setReviews((previous) => [result.data, ...previous]);
      setOverallRating(result.updatedProperty.rating);
      setTotalReviews(result.updatedProperty.reviews);
      setReviewText('');
      setReviewRating(5);
    } catch (requestError) {
      setError(requestError.message || 'Unable to submit your review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 border-t border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Star size={24} className="fill-rose-500 text-rose-500" />
        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
          {Number(overallRating || 0).toFixed(2)} • {totalReviews} reviews
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between text-xs">
            <span className="text-gray-700 font-medium">{metric.label}</span>
            <div className="flex items-center gap-3 w-44">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900 rounded-full" style={{ width: metric.width }} />
              </div>
              <span className="font-bold text-gray-900 w-6 text-right">{metric.score}</span>
            </div>
          </div>
        ))}
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-gray-200 p-5 space-y-3">
          <h3 className="font-bold text-gray-900">Write a review</h3>
          <label className="block text-xs font-semibold text-gray-700">
            Rating
            <select
              value={reviewRating}
              onChange={(event) => setReviewRating(Number(event.target.value))}
              className="ml-3 rounded-lg border border-gray-300 px-2 py-1"
            >
              {[5, 4, 3, 2, 1].map((score) => (
                <option key={score} value={score}>{score} stars</option>
              ))}
            </select>
          </label>
          <textarea
            required
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            rows={3}
            placeholder="Share details about your stay"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
          >
            {submitting ? 'Posting…' : 'Post review'}
          </button>
        </form>
      )}
      {!user && (
        <p className="mb-6 text-sm text-gray-500">
          <Link to="/login" className="font-semibold text-rose-600 hover:underline">Sign in</Link> to write a review.
        </p>
      )}

      {error && (
        <p role="alert" className="mb-4 text-sm text-rose-700">{error}</p>
      )}
      {loading ? (
        <p className="text-sm text-gray-500">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="p-5 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                  alt={review.author}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-xs md:text-sm">{review.author}</h4>
                  <p className="text-[11px] text-gray-400">{review.date}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
