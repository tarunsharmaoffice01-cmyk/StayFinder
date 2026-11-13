
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/appError.js';

// Convert Supabase database fields into the frontend format
const formatListing = (item) => ({
  id: item.id,
  title: item.title,
  location: item.location,
  country: item.country,
  price: Number(item.price),
  rating: Number(item.rating || 0),
  reviews: Number(item.reviews || 0),
  propertyType: item.property_type,
  category: item.category,
  isSuperhost: item.is_superhost,
  guests: item.guests,
  bedrooms: item.bedrooms,
  beds: item.beds,
  bathrooms: item.bathrooms,
  cleaningFee: Number(item.cleaning_fee || 0),
  description: item.description,
  images: item.images || [],
  amenities: item.amenities || [],
  hostUserId: item.host_user_id,
  hostName: item.host_name,
  hostImage: item.host_image,
  hostResponseRate: item.host_response_rate,
  hostDuration: item.host_duration,
  houseRules: item.house_rules || [],
  createdAt: item.created_at
});

export const getListings = async (query = {}) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*');

  if (error) {
    throw new AppError(error.message, 500);
  }

  let listings = (data || []).map(formatListing);

  const {
    destination,
    category,
    minPrice,
    maxPrice,
    guests,
    propertyType,
    minRating,
    amenities,
    sortBy = 'relevance',
    page,
    limit
  } = query;

  if (destination && destination.trim()) {
    const q = destination.toLowerCase().trim();
    listings = listings.filter(item =>
      item.title?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.country?.toLowerCase().includes(q) ||
      item.propertyType?.toLowerCase().includes(q)
    );
  }

  if (category && category.toLowerCase() !== 'all') {
    listings = listings.filter(
      item => item.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice !== undefined && !isNaN(minPrice)) {
    const min = Number(minPrice);
    if (min > 0) listings = listings.filter(item => item.price >= min);
  }

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    const max = Number(maxPrice);
    if (max > 0) listings = listings.filter(item => item.price <= max);
  }

  if (guests !== undefined && !isNaN(guests)) {
    const g = Number(guests);
    if (g > 1) listings = listings.filter(item => (item.guests || 1) >= g);
  }

  if (propertyType && propertyType.toLowerCase() !== 'all') {
    listings = listings.filter(
      item => item.propertyType?.toLowerCase() === propertyType.toLowerCase()
    );
  }

  if (minRating !== undefined && !isNaN(minRating)) {
    const r = Number(minRating);
    if (r > 0) listings = listings.filter(item => item.rating >= r);
  }

  if (amenities) {
    const amenityArray = Array.isArray(amenities)
      ? amenities
      : String(amenities).split(',').map(a => a.trim()).filter(Boolean);

    if (amenityArray.length > 0) {
      listings = listings.filter(item =>
        amenityArray.every(amenity =>
          item.amenities?.some(a =>
            a.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
    }
  }

  if (sortBy === 'price_asc') {
    listings.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    listings.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating_desc') {
    listings.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'reviews_desc') {
    listings.sort((a, b) => b.reviews - a.reviews);
  }

  const total = listings.length;

  if (page && limit) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const startIndex = (pageNum - 1) * limitNum;
    listings = listings.slice(startIndex, startIndex + limitNum);
  }

  return { listings, total };
};

export const getListingById = async (id) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new AppError(error.message, 500);
  if (!data) {
    throw new AppError(`Property with id '${id}' not found.`, 404);
  }

  return formatListing(data);
};

export const createListing = async (data, user) => {
  if (!user?.id) {
    throw new AppError('Please login to publish a property.', 401);
  }

  const newListing = {
    id: `sf-user-${Date.now()}`,
    title: data.title,
    location: data.location,
    country: data.country,
    price: Number(data.price),
    rating: 5,
    reviews: 0,
    property_type: data.propertyType,
    category: data.category,
    is_superhost: false,
    guests: Number(data.guests),
    bedrooms: Number(data.bedrooms || 1),
    beds: Number(data.beds || 1),
    bathrooms: Number(data.bathrooms || 1),
    cleaning_fee: Number(data.cleaningFee || 50),
    description: data.description,
    images: data.images?.length
      ? data.images
      : [data.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200'],
    amenities: data.amenities || [],
    host_user_id: user.id,
    host_name: data.hostName || user.name,
    host_image: data.hostImage || user.avatar,
    host_response_rate: data.hostResponseRate || '100%',
    host_duration: data.hostDuration || 'Joined 2026',
    house_rules: data.houseRules || [
      'Check-in after 3:00 PM',
      'Checkout before 11:00 AM',
      'No smoking indoors',
      'Please respect neighbors'
    ]
  };

  const { data: savedListing, error } = await supabase
    .from('properties')
    .insert(newListing)
    .select()
    .single();

  if (error) throw new AppError(error.message, 500);

  return formatListing(savedListing);
};

export const getUserListings = async (userId) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('host_user_id', userId);

  if (error) throw new AppError(error.message, 500);

  return (data || []).map(formatListing);
};

export const deleteUserListing = async (listingId, userId, userRole) => {
  const { data: listing, error: fetchError } = await supabase
    .from('properties')
    .select('id, host_user_id')
    .eq('id', listingId)
    .maybeSingle();

  if (fetchError) throw new AppError(fetchError.message, 500);

  if (!listing) {
    throw new AppError(`Listing with id '${listingId}' not found.`, 404);
  }

  const isOwner = listing.host_user_id === userId;
  const isAdmin = userRole?.toLowerCase() === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError('You do not have permission to delete this listing.', 403);
  }

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', listingId);

  if (error) throw new AppError(error.message, 500);

  return { success: true, id: listingId };
};

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) throw new AppError(error.message, 500);

  return (data || []).map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon
  }));
};

export const getDestinations = async () => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*');

  if (error) throw new AppError(error.message, 500);

  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    country: item.country,
    image: item.image,
    tag: item.tag,
    propertiesCount: item.properties_count
  }));
};

export default {
  getListings,
  getListingById,
  createListing,
  getUserListings,
  deleteUserListing,
  getCategories,
  getDestinations
};
