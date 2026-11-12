import { memoryStore } from '../data/memoryStore.js';
import { AppError } from '../utils/appError.js';

export const getListings = async (query = {}) => {
  let listings = memoryStore.getAllListings();

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

  // 1. Destination / Keyword Search
  if (destination && destination.trim()) {
    const q = destination.toLowerCase().trim();
    listings = listings.filter(item =>
      item.title?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.country?.toLowerCase().includes(q) ||
      item.propertyType?.toLowerCase().includes(q)
    );
  }

  // 2. Category Filter
  if (category && category.toLowerCase() !== 'all') {
    const cat = category.toLowerCase();
    listings = listings.filter(item => item.category?.toLowerCase() === cat);
  }

  // 3. Price Filter
  if (minPrice !== undefined && !isNaN(minPrice)) {
    const min = Number(minPrice);
    if (min > 0) listings = listings.filter(item => item.price >= min);
  }
  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    const max = Number(maxPrice);
    if (max > 0) listings = listings.filter(item => item.price <= max);
  }

  // 4. Guest Capacity Filter
  if (guests !== undefined && !isNaN(guests)) {
    const g = Number(guests);
    if (g > 1) listings = listings.filter(item => (item.guests || 1) >= g);
  }

  // 5. Property Type Filter
  if (propertyType && propertyType.toLowerCase() !== 'all') {
    const pt = propertyType.toLowerCase();
    listings = listings.filter(item => item.propertyType?.toLowerCase() === pt);
  }

  // 6. Rating Filter
  if (minRating !== undefined && !isNaN(minRating)) {
    const r = Number(minRating);
    if (r > 0) listings = listings.filter(item => (item.rating || 0) >= r);
  }

  // 7. Amenities Filter
  if (amenities) {
    const amenityArray = Array.isArray(amenities)
      ? amenities
      : String(amenities).split(',').map(a => a.trim()).filter(Boolean);

    if (amenityArray.length > 0) {
      listings = listings.filter(item =>
        amenityArray.every(amenity =>
          item.amenities?.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
        )
      );
    }
  }

  // 8. Sorting
  if (sortBy === 'price_asc') {
    listings.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    listings.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating_desc') {
    listings.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'reviews_desc') {
    listings.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
  }

  const total = listings.length;

  // 9. Pagination (optional)
  if (page && limit) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const startIndex = (pageNum - 1) * limitNum;
    listings = listings.slice(startIndex, startIndex + limitNum);
  }

  return { listings, total };
};

export const getListingById = async (id) => {
  const listing = memoryStore.findListingById(id);
  if (!listing) {
    throw new AppError(`Property with id '${id}' not found.`, 404);
  }
  return listing;
};

export const createListing = async (data, user) => {
  const newListing = {
    ...data,
    id: `sf-user-${Date.now()}`,
    hostUserId: user ? user.id : 'usr-student-01',
    hostName: data.hostName || (user ? user.name : 'StayFinder Host'),
    hostImage: data.hostImage || (user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'),
    hostDuration: data.hostDuration || 'Joined 2026',
    hostResponseRate: data.hostResponseRate || '100%',
    price: Number(data.price),
    guests: Number(data.guests),
    bedrooms: Number(data.bedrooms || 1),
    beds: Number(data.beds || 1),
    bathrooms: Number(data.bathrooms || 1),
    cleaningFee: Number(data.cleaningFee || 50),
    rating: 5.0,
    reviews: 1,
    isSuperhost: false,
    images: data.images && data.images.length > 0 ? data.images : [
      data.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80'
    ],
    houseRules: data.houseRules || [
      'Check-in after 3:00 PM',
      'Checkout before 11:00 AM',
      'No smoking indoors',
      'Please respect neighbors'
    ],
    createdAt: new Date().toISOString()
  };

  return memoryStore.createListing(newListing);
};

export const getUserListings = async (userId) => {
  return memoryStore.getListingsByHost(userId);
};

export const deleteUserListing = async (listingId, userId, userRole) => {
  const listing = memoryStore.findListingById(listingId);
  if (!listing) {
    throw new AppError(`Listing with id '${listingId}' not found.`, 404);
  }

  // Only the host who owns the listing or an admin can delete it
  const isOwner = listing.hostUserId === userId;
  const isAdmin = userRole?.toLowerCase() === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError('You do not have permission to delete this listing.', 403);
  }

  memoryStore.deleteListing(listingId);
  return { success: true, id: listingId };
};

export const getCategories = async () => {
  return memoryStore.getCategories();
};

export const getDestinations = async () => {
  return memoryStore.getDestinations();
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
