import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Award } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/priceCalculator';

export const PropertyCard = ({ property }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageIndex, setImageIndex] = useState(0);

  if (!property) return null;

  const isFavorited = isInWishlist(property.id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(property.id);
  };

  return (
    <Link
      to={`/property/${property.id}`}
      className="group block flex-col focus:outline-none"
    >
      {/* Property Image Container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 mb-3 shadow-xs">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80'}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Superhost Badge */}
        {property.isSuperhost && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Award size={13} className="text-rose-500 fill-rose-500" />
            <span>Superhost</span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleHeartClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 p-2 rounded-full transition-transform active:scale-80 hover:scale-110 focus:outline-none group/btn"
        >
          <Heart
            size={22}
            className={`transition-colors drop-shadow-sm ${
              isFavorited
                ? 'fill-rose-500 text-rose-500 stroke-[1.5]'
                : 'text-white fill-black/30 stroke-[2] group-hover/btn:scale-105'
            }`}
          />
        </button>
      </div>

      {/* Property Meta */}
      <div className="space-y-1">
        {/* Row 1: Location & Rating */}
        <div className="flex items-center justify-between text-sm">
          <h3 className="font-bold text-gray-900 truncate pr-2">
            {property.location || `${property.city}, ${property.country}`}
          </h3>
          <div className="flex items-center gap-1 font-semibold text-gray-900 flex-shrink-0 text-xs">
            <Star size={13} className="fill-gray-900 text-gray-900" />
            <span>{property.rating ? property.rating.toFixed(2) : 'New'}</span>
          </div>
        </div>

        {/* Row 2: Property Type & Specs */}
        <p className="text-xs text-gray-500 truncate">
          {property.propertyType} • {property.guests} guests • {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
        </p>

        {/* Row 3: Country / Highlight */}
        <p className="text-xs text-gray-400 truncate">
          {property.country}
        </p>

        {/* Row 4: Price */}
        <div className="pt-1 flex items-baseline gap-1 text-sm">
          <span className="font-extrabold text-gray-900">
            {formatCurrency(property.price)}
          </span>
          <span className="text-xs text-gray-600 font-normal">night</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

