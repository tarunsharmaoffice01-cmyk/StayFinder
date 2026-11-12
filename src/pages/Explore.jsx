import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  MapPin,
  Star,
  Users
} from 'lucide-react';
import { useListings } from '../hooks/useListings';
import { PropertyGrid } from '../components/PropertyGrid';
import { FilterModal } from '../components/FilterModal';
import { formatCurrency } from '../utils/priceCalculator';

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL parameters
  const initialDestination = searchParams.get('destination') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialGuests = parseInt(searchParams.get('guests'), 10) || 1;

  const [destinationInput, setDestinationInput] = useState(initialDestination);
  const [filters, setFilters] = useState({
    destination: initialDestination,
    category: initialCategory,
    minPrice: 0,
    maxPrice: 1000,
    guests: initialGuests,
    propertyType: 'all',
    minRating: 0,
    amenities: [],
    sortBy: 'relevance'
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Sync with URL query parameter changes
  useEffect(() => {
    const dest = searchParams.get('destination') || '';
    const cat = searchParams.get('category') || 'all';
    const gst = parseInt(searchParams.get('guests'), 10) || 1;

    setFilters(prev => ({
      ...prev,
      destination: dest,
      category: cat,
      guests: gst
    }));
    setDestinationInput(dest);
  }, [searchParams]);

  const { listings, loading, error } = useListings(filters);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, destination: destinationInput.trim() }));
  };

  const handleApplyModalFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetAll = () => {
    const cleared = {
      destination: '',
      category: 'all',
      minPrice: 0,
      maxPrice: 1000,
      guests: 1,
      propertyType: 'all',
      minRating: 0,
      amenities: [],
      sortBy: 'relevance'
    };
    setFilters(cleared);
    setDestinationInput('');
    setSearchParams({});
  };

  // Count active non-default filters
  const activeFiltersCount = [
    filters.destination !== '',
    filters.category !== 'all',
    filters.minPrice > 0,
    filters.maxPrice < 1000,
    filters.guests > 1,
    filters.propertyType !== 'all',
    filters.minRating > 0,
    filters.amenities.length > 0,
    filters.sortBy !== 'relevance'
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Explore All Vacation Stays
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            {listings.length} {listings.length === 1 ? 'stay' : 'stays'} available worldwide
          </p>
        </div>

        {/* Search Input & Filter Button */}
        <div className="flex items-center gap-2.5">
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 md:w-80 relative flex items-center"
          >
            <Search size={16} className="absolute left-3.5 text-gray-400" />
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              placeholder="Search by city, country or stay..."
              className="w-full bg-white border border-gray-200 rounded-full pl-9 pr-8 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-xs"
            />
            {destinationInput && (
              <button
                type="button"
                onClick={() => {
                  setDestinationInput('');
                  setFilters(prev => ({ ...prev, destination: '' }));
                }}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Filter Modal Trigger */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-800 bg-white rounded-full px-4 py-2.5 text-xs font-bold text-gray-800 transition shadow-xs flex-shrink-0"
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Badges Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-gray-100">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
            Active Filters:
          </span>

          {filters.destination && (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
              <MapPin size={12} className="text-rose-500" />
              <span>{filters.destination}</span>
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, destination: '' }));
                  setDestinationInput('');
                }}
                className="hover:text-black ml-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.propertyType !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
              <span>Type: {filters.propertyType}</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, propertyType: 'all' }))}
                className="hover:text-black ml-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
              <span>{formatCurrency(filters.minPrice)} - {formatCurrency(filters.maxPrice)}</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: 1000 }))}
                className="hover:text-black ml-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
              <Star size={12} className="text-rose-500 fill-rose-500" />
              <span>{filters.minRating}+ Rating</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
                className="hover:text-black ml-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.guests > 1 && (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
              <Users size={12} />
              <span>{filters.guests}+ Guests</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, guests: 1 }))}
                className="hover:text-black ml-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.amenities?.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full"
            >
              <span>{amenity}</span>
              <button
                onClick={() =>
                  setFilters(prev => ({
                    ...prev,
                    amenities: prev.amenities.filter(a => a !== amenity)
                  }))
                }
                className="hover:text-black ml-0.5"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          <button
            onClick={handleResetAll}
            className="text-xs font-bold text-rose-500 hover:underline inline-flex items-center gap-1 ml-2"
          >
            <RotateCcw size={12} />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Property Results Grid */}
      <PropertyGrid
        listings={listings}
        loading={loading}
        error={error}
        onResetFilters={handleResetAll}
      />

      {/* Filter Modal Dialog */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyModalFilters}
        totalMatching={listings.length}
      />
    </div>
  );
};

export default Explore;
