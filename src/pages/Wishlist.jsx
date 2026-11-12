import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useListings } from '../hooks/useListings';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyGridSkeleton } from '../components/Loader';

export const Wishlist = () => {
  const { wishlist, wishlistCount, clearWishlist } = useWishlist();
  const { listings, loading } = useListings();

  // Filter listings by wishlist IDs
  const savedProperties = listings.filter(l => wishlist.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Heart size={26} className="text-rose-500 fill-rose-500" />
            <span>My Wishlist</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {wishlistCount} {wishlistCount === 1 ? 'saved vacation stay' : 'saved vacation stays'}
          </p>
        </div>

        {wishlistCount > 0 && (
          <button
            onClick={clearWishlist}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition"
          >
            <Trash2 size={14} />
            <span>Clear Wishlist</span>
          </button>
        )}
      </div>

      {loading ? (
        <PropertyGridSkeleton count={4} />
      ) : savedProperties.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
            <Heart size={36} className="stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-xs md:text-sm text-gray-500 mb-6">
            As you search, tap the heart icon on any stay to save your favorite vacation rentals here for later.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-3.5 rounded-full shadow-md transition active:scale-95"
          >
            <span>Start Exploring Stays</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

