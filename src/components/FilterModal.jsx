import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, RotateCcw } from 'lucide-react';
import { formatCurrency } from '../utils/priceCalculator';

const PROPERTY_TYPES = ['All', 'Villa', 'Chalet', 'Apartment', 'Cabin', 'Treehouse', 'Townhouse', 'House', 'Bungalow', 'Loft', 'Castle'];

const AMENITY_OPTIONS = [
  'WiFi',
  'Pool',
  'Hot Tub',
  'Full Kitchen',
  'Air Conditioning',
  'Fireplace',
  'Free Parking',
  'Sauna',
  'Ocean View',
  'Mountain View'
];

export const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  totalMatching = 0
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  if (!isOpen) return null;

  const handleToggleAmenity = (amenity) => {
    setLocalFilters(prev => {
      const current = prev.amenities || [];
      const updated = current.includes(amenity)
        ? current.filter(a => a !== amenity)
        : [...current, amenity];
      return { ...prev, amenities: updated };
    });
  };

  const handleReset = () => {
    const defaultState = {
      minPrice: 0,
      maxPrice: 1000,
      propertyType: 'all',
      minRating: 0,
      guests: 1,
      amenities: [],
      sortBy: 'relevance'
    };
    setLocalFilters(defaultState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-rose-500" />
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1 text-xs md:text-sm">
          {/* Price Range */}
          <div>
            <h4 className="font-extrabold text-gray-900 mb-2">Price Range (per night)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-1">Minimum ($)</label>
                <input
                  type="number"
                  min={0}
                  max={localFilters.maxPrice || 1000}
                  value={localFilters.minPrice || 0}
                  onChange={(e) => setLocalFilters({ ...localFilters, minPrice: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-1">Maximum ($)</label>
                <input
                  type="number"
                  min={localFilters.minPrice || 0}
                  value={localFilters.maxPrice === Infinity ? 1000 : localFilters.maxPrice}
                  onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100" />

          {/* Property Type */}
          <div>
            <h4 className="font-extrabold text-gray-900 mb-3">Property Type</h4>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => {
                const isSelected = (localFilters.propertyType || 'all').toLowerCase() === type.toLowerCase();
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, propertyType: type.toLowerCase() })}
                    className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition ${
                      isSelected
                        ? 'border-gray-900 bg-gray-900 text-white shadow-xs'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-[1px] bg-gray-100" />

          {/* Minimum Rating */}
          <div>
            <h4 className="font-extrabold text-gray-900 mb-2">Guest Rating</h4>
            <div className="flex gap-2">
              {[0, 4.5, 4.8, 4.9].map((rate) => {
                const isSelected = (localFilters.minRating || 0) === rate;
                return (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, minRating: rate })}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition text-center ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 text-rose-600'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {rate === 0 ? 'Any Rating' : `★ ${rate}+`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-[1px] bg-gray-100" />

          {/* Amenities */}
          <div>
            <h4 className="font-extrabold text-gray-900 mb-3">Amenities</h4>
            <div className="grid grid-cols-2 gap-2.5">
              {AMENITY_OPTIONS.map((amenity) => {
                const isChecked = localFilters.amenities?.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition text-xs font-medium ${
                      isChecked
                        ? 'border-rose-500 bg-rose-50/50 text-rose-900'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked || false}
                      onChange={() => handleToggleAmenity(amenity)}
                      className="rounded text-rose-500 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="h-[1px] bg-gray-100" />

          {/* Sort By */}
          <div>
            <h4 className="font-extrabold text-gray-900 mb-2">Sort Results By</h4>
            <select
              value={localFilters.sortBy || 'relevance'}
              onChange={(e) => setLocalFilters({ ...localFilters, sortBy: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs md:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="relevance">Recommended (Relevance)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="reviews_desc">Most Reviewed</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 underline"
          >
            <RotateCcw size={13} />
            <span>Clear all</span>
          </button>

          <button
            onClick={handleSubmit}
            className="bg-gray-900 hover:bg-black text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95"
          >
            Show Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;

