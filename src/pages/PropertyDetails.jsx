import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Award,
  MapPin,
  Share2,
  Heart,
  Wifi,
  Waves,
  Car,
  Utensils,
  Tv,
  Flame,
  Wind,
  Bath,
  Coffee,
  Check,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { fetchListingById } from '../services/listingService';
import { ImageGallery } from '../components/ImageGallery';
import { BookingCard } from '../components/BookingCard';
import { ReviewSection } from '../components/ReviewSection';
import { PropertyDetailSkeleton } from '../components/Loader';
import { useWishlist } from '../context/WishlistContext';

export const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchListingById(id);
        setProperty(response.data);
      } catch (err) {
        setError(err.message || 'Property details not found');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'This stay listing is currently unavailable.'}</p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-3 rounded-full transition"
        >
          <ArrowLeft size={16} />
          <span>Back to all stays</span>
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(property.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight size={12} />
        <Link to="/explore" className="hover:text-gray-900">Stays</Link>
        <ChevronRight size={12} />
        <span className="text-gray-800 font-medium truncate max-w-xs">{property.location}</span>
      </div>

      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-snug">
            {property.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
            <div className="flex items-center gap-1 font-bold text-gray-900">
              <Star size={14} className="fill-current text-gray-900" />
              <span>{property.rating?.toFixed(2) || '4.95'}</span>
              <span className="text-gray-400 font-normal">({property.reviews} reviews)</span>
            </div>

            {property.isSuperhost && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1 font-semibold text-gray-800">
                  <Award size={14} className="text-rose-500 fill-rose-500" />
                  <span>Superhost</span>
                </div>
              </>
            )}

            <span>•</span>
            <div className="flex items-center gap-1 font-medium underline text-gray-700">
              <MapPin size={14} className="text-rose-500" />
              <span>{property.location}, {property.country}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Share & Save */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition"
          >
            {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => toggleWishlist(property.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition ${
              isFavorited
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Heart size={14} className={isFavorited ? 'fill-rose-500 text-rose-500' : ''} />
            <span>{isFavorited ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* 5-Image Mosaic Gallery */}
      <ImageGallery images={property.images} title={property.title} />

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">
        {/* Left 7-Col: Specs, Host, Description, Amenities, House Rules */}
        <div className="lg:col-span-7 space-y-8">
          {/* Host & Property Specs Card */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {property.propertyType} hosted by {property.hostName}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {property.guests} guests • {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'} • {property.beds} {property.beds === 1 ? 'bed' : 'beds'} • {property.bathrooms} baths
              </p>
            </div>

            <img
              src={property.hostImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
              alt={property.hostName}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
            />
          </div>

          {/* Superhost Highlights */}
          <div className="space-y-4 pb-6 border-b border-gray-200 text-xs md:text-sm">
            {property.isSuperhost && (
              <div className="flex items-start gap-4">
                <Award size={22} className="text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900">{property.hostName} is a Superhost</h4>
                  <p className="text-xs text-gray-500">Superhosts are experienced, highly rated hosts committed to providing great stays for guests.</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <MapPin size={22} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900">Exceptional Location</h4>
                <p className="text-xs text-gray-500">98% of recent guests gave the location a 5-star rating.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock size={22} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900">Flexible Check-in</h4>
                <p className="text-xs text-gray-500">Self check-in with keypad or lockbox available.</p>
              </div>
            </div>
          </div>

          {/* StayCover Banner */}
          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-center gap-1.5 text-rose-500 font-black text-lg mb-2">
              <ShieldCheck size={24} />
              <span>stay<span className="text-gray-900">cover</span></span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like trouble checking in.
            </p>
          </div>

          {/* Description */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-3">About this space</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              {isDescExpanded ? property.description : `${property.description.slice(0, 240)}...`}
            </p>
            {property.description.length > 240 && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="mt-2 text-xs font-bold text-gray-900 underline hover:text-rose-500 transition"
              >
                {isDescExpanded ? 'Show less' : 'Show more →'}
              </button>
            )}
          </div>

          {/* Amenities Grid */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-4">What this place offers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-gray-700">
              {property.amenities?.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/60 border border-gray-100">
                  <Check size={16} className="text-rose-500 flex-shrink-0" />
                  <span className="font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-3">House Rules</h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-600">
              {property.houseRules?.map((rule, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Host Profile Info Box */}
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex items-start gap-4">
            <img
              src={property.hostImage}
              alt={property.hostName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
            />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-base text-gray-900">Hosted by {property.hostName}</h4>
              <p className="text-gray-500">{property.hostDuration || '5 years hosting'}</p>
              <p className="text-gray-500">Response rate: <strong className="text-gray-800">{property.hostResponseRate || '100%'}</strong> • Responds within an hour</p>
            </div>
          </div>
        </div>

        {/* Right 5-Col: Sticky Booking Card */}
        <div className="lg:col-span-5">
          <BookingCard property={property} />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <ReviewSection rating={property.rating} reviewCount={property.reviews} />
      </div>
    </div>
  );
};

export default PropertyDetails;

