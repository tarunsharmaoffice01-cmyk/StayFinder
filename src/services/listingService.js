import { MOCK_LISTINGS } from '../data/mockListings';
import { apiClient } from './api';

const CUSTOM_LISTINGS_KEY = 'stayfinder_custom_listings_v1';

/**
 * Retrieves all user-created listings from localStorage
 */
const getStoredCustomListings = () => {
  try {
    const data = localStorage.getItem(CUSTOM_LISTINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse custom listings from localStorage', e);
    return [];
  }
};

/**
 * Combines mock listings with user-created listings
 */
const getAllListingsRaw = () => {
  const customListings = getStoredCustomListings();
  return [...customListings, ...MOCK_LISTINGS];
};

/**
 * Fetches listings with comprehensive filtering and sorting options
 */
export const fetchListings = async ({
  destination = '',
  category = 'all',
  minPrice = 0,
  maxPrice = Infinity,
  guests = 1,
  propertyType = 'all',
  minRating = 0,
  amenities = [],
  sortBy = 'relevance'
} = {}) => {
  return apiClient.get('/api/listings', () => {
    let listings = getAllListingsRaw();

    // 1. Destination / Keyword Search
    if (destination && destination.trim().length > 0) {
      const q = destination.toLowerCase().trim();
      listings = listings.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.propertyType.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (category && category !== 'all') {
      listings = listings.filter(item =>
        item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // 3. Price Filter
    if (minPrice > 0) {
      listings = listings.filter(item => item.price >= minPrice);
    }
    if (maxPrice && maxPrice < Infinity) {
      listings = listings.filter(item => item.price <= maxPrice);
    }

    // 4. Guests Capacity Filter
    if (guests > 1) {
      listings = listings.filter(item => item.guests >= Number(guests));
    }

    // 5. Property Type Filter
    if (propertyType && propertyType !== 'all') {
      listings = listings.filter(item =>
        item.propertyType.toLowerCase() === propertyType.toLowerCase()
      );
    }

    // 6. Rating Filter
    if (minRating > 0) {
      listings = listings.filter(item => item.rating >= minRating);
    }

    // 7. Amenities Checkbox Filter
    if (amenities && amenities.length > 0) {
      listings = listings.filter(item =>
        amenities.every(amenity =>
          item.amenities?.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
        )
      );
    }

    // 8. Sorting
    if (sortBy === 'price_asc') {
      listings.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      listings.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating_desc') {
      listings.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews_desc') {
      listings.sort((a, b) => b.reviews - a.reviews);
    }

    return listings;
  });
};

/**
 * Fetches single listing by ID
 */
export const fetchListingById = async (id) => {
  return apiClient.get(`/api/listings/${id}`, () => {
    const all = getAllListingsRaw();
    const found = all.find(item => item.id === id);
    if (!found) {
      throw new Error(`Property with id ${id} not found.`);
    }
    return found;
  });
};

/**
 * Saves a newly submitted host listing to localStorage
 */
export const createListing = async (newListingData) => {
  return apiClient.post('/api/listings', newListingData, (payload) => {
    const existing = getStoredCustomListings();
    const newListing = {
      ...payload,
      id: `sf-user-${Date.now()}`,
      rating: 5.0,
      reviews: 1,
      isSuperhost: false,
      cleaningFee: payload.cleaningFee || 50,
      houseRules: payload.houseRules || [
        "Check-in after 3:00 PM",
        "Checkout before 11:00 AM",
        "No smoking indoors",
        "Please respect neighbors"
      ]
    };

    const updated = [newListing, ...existing];
    localStorage.setItem(CUSTOM_LISTINGS_KEY, JSON.stringify(updated));
    return newListing;
  });
};

/**
 * Fetches all custom listings created by user
 */
export const fetchUserListings = async () => {
  return apiClient.get('/api/user/listings', () => {
    return getStoredCustomListings();
  });
};

/**
 * Deletes a custom listing created by user
 */
export const deleteUserListing = async (id) => {
  return apiClient.post(`/api/user/listings/${id}/delete`, id, (listingId) => {
    const existing = getStoredCustomListings();
    const filtered = existing.filter(item => item.id !== listingId);
    localStorage.setItem(CUSTOM_LISTINGS_KEY, JSON.stringify(filtered));
    return { success: true, id: listingId };
  });
};

export default {
  fetchListings,
  fetchListingById,
  createListing,
  fetchUserListings,
  deleteUserListing
};

