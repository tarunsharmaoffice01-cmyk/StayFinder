import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  Image,
  DollarSign,
  MapPin,
  Check,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { createListing } from '../services/listingService';
import { useAuth } from '../context/AuthContext';

const PRESET_SAMPLE_IMAGES = [
  {
    name: 'Modern Glass Chalet',
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Cliffside Mediterranean Villa',
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Secluded Forest Timber Cabin',
    url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Luxury Tropical Bamboo Treehouse',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80'
  }
];

const AMENITIES_LIST = [
  'Fast WiFi (300 Mbps)',
  'Private Pool',
  'Outdoor Hot Tub',
  'Full Chef Kitchen',
  'Indoor Fireplace',
  'Air Conditioning',
  'Free Parking on premises',
  'Mountain View',
  'Ocean View',
  'Dedicated Workspace',
  'Private Cedar Sauna',
  'Espresso Machine'
];

export const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    country: '',
    price: 250,
    propertyType: 'Villa',
    category: 'luxury',
    guests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    cleaningFee: 65,
    imageUrl: PRESET_SAMPLE_IMAGES[0].url,
    description: '',
    amenities: ['Fast WiFi (300 Mbps)', 'Full Chef Kitchen', 'Air Conditioning']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleToggleAmenity = (item) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter(a => a !== item)
        : [...prev.amenities, item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.location || !formData.country || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createListing({
        ...formData,
        price: Number(formData.price),
        guests: Number(formData.guests),
        bedrooms: Number(formData.bedrooms),
        beds: Number(formData.beds),
        bathrooms: Number(formData.bathrooms),
        images: [
          formData.imageUrl,
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80'
        ],
        hostName: user.name,
        hostImage: user.avatar,
        hostDuration: 'Joined 2026',
        hostResponseRate: '100%'
      });

      navigate('/host/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to publish listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Top Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-10 shadow-xs">
        <div className="mb-8">
          <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
            Become a Host
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Publish your stay on StayFinder
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Provide details about your property to list it across our platform
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 text-xs md:text-sm">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              1. Basic Property Information
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Property Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Modern Glass Alpine Chalet with Forest Views"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  City & Region *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Zermatt, Valais"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. Switzerland"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Villa">Villa</option>
                  <option value="Chalet">Chalet</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Cabin">Cabin</option>
                  <option value="Treehouse">Treehouse</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="House">House</option>
                  <option value="Loft">Loft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="luxury">Luxury Stays</option>
                  <option value="skiing">Ski-in / Ski-out</option>
                  <option value="beachfront">Beachfront</option>
                  <option value="cabins">Cabins</option>
                  <option value="treehouses">Treehouses</option>
                  <option value="city">Iconic Cities</option>
                  <option value="lakefront">Lakefront</option>
                  <option value="desert">Desert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Capacity */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              2. Pricing & Guest Capacity
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Price / Night ($) *</label>
                <input
                  type="number"
                  min={20}
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Max Guests *</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  required
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  min={1}
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Beds</label>
                <input
                  type="number"
                  min={1}
                  value={formData.beds}
                  onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  min={1}
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Photography */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              3. Photography
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Main Image URL *
              </label>
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-mono text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Or pick a preset high-resolution architecture sample:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_SAMPLE_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: sample.url })}
                    className={`p-2 rounded-2xl border text-left transition ${
                      formData.imageUrl === sample.url
                        ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-video w-full rounded-xl overflow-hidden mb-1.5 bg-gray-100">
                      <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-800 block truncate">
                      {sample.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Amenities */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              4. Included Amenities
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AMENITIES_LIST.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleToggleAmenity(amenity)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/70 text-rose-800'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                      isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <Check size={12} className="stroke-[3]" />}
                    </div>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Description */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              5. Space Description
            </h2>

            <div>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what makes your space special, the view, architecture, and surrounding neighborhood..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 font-bold text-xs text-gray-700 rounded-full transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs md:text-sm px-8 py-3.5 rounded-full shadow-md transition active:scale-95 flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Stay Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
