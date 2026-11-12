import React from 'react';
import { PropertyCard } from './PropertyCard';
import { PropertyGridSkeleton } from './Loader';
import { SearchX, RotateCcw } from 'lucide-react';

export const PropertyGrid = ({ listings = [], loading = false, onResetFilters }) => {
  if (loading) {
    return <PropertyGridSkeleton count={8} />;
  }

  if (listings.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchX size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
        <p className="text-sm text-gray-500 mb-6">
          Try adjusting your search criteria, clearing your price filters, or picking a different category.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            <RotateCcw size={14} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {listings.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;

