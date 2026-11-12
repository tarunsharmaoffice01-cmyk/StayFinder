import React from 'react';
import { Star, ThumbsUp, ShieldCheck } from 'lucide-react';

const SAMPLE_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Sophie Dubois',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    date: 'October 2026',
    rating: 5,
    text: 'An absolute dream stay! The architecture and attention to detail exceeded every expectation. The views from the terrace were mesmerizing at sunrise. Our hosts were attentive, friendly, and gave phenomenal local recommendations.'
  },
  {
    id: 'rev-2',
    author: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    date: 'September 2026',
    rating: 5,
    text: 'Everything was pristine. The kitchen was stocked with high-end appliances, the beds were ultra-comfortable, and the sauna was incredible after long hiking days. We cannot wait to return next year.'
  },
  {
    id: 'rev-3',
    author: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    date: 'August 2026',
    rating: 5,
    text: 'Pictures honestly do not do this place justice. It is peaceful, ultra-private, and the design touches make you feel instantly at home. Check-in was completely seamless.'
  },
  {
    id: 'rev-4',
    author: 'David Lindqvist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    date: 'July 2026',
    rating: 4.9,
    text: 'A true 5-star experience. The host went above and beyond when our flight was delayed, greeting us personally and having warm bread and fresh coffee waiting for us.'
  }
];

export const ReviewSection = ({ rating = 4.96, reviewCount = 120 }) => {
  const metrics = [
    { label: 'Cleanliness', score: '4.9', width: '98%' },
    { label: 'Accuracy', score: '4.9', width: '98%' },
    { label: 'Communication', score: '5.0', width: '100%' },
    { label: 'Location', score: '4.9', width: '97%' },
    { label: 'Check-in', score: '5.0', width: '100%' },
    { label: 'Value', score: '4.8', width: '96%' }
  ];

  return (
    <div className="py-8 border-t border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Star size={24} className="fill-rose-500 text-rose-500" />
        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
          {rating.toFixed(2)} • {reviewCount} reviews
        </h2>
      </div>

      {/* Metrics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between text-xs">
            <span className="text-gray-700 font-medium">{m.label}</span>
            <div className="flex items-center gap-3 w-44">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 rounded-full"
                  style={{ width: m.width }}
                />
              </div>
              <span className="font-bold text-gray-900 w-6 text-right">{m.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SAMPLE_REVIEWS.map((review) => (
          <div key={review.id} className="p-5 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={review.avatar}
                alt={review.author}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-xs md:text-sm">{review.author}</h4>
                <p className="text-[11px] text-gray-400">{review.date}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              "{review.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;

