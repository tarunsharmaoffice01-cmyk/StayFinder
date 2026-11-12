import { apiClient } from './api';

const buildListingQuery = ({
  destination,
  category,
  minPrice,
  maxPrice,
  guests,
  propertyType,
  minRating,
  amenities,
  sortBy
} = {}) => {
  const params = new URLSearchParams();
  const filters = {
    destination,
    category,
    minPrice,
    maxPrice,
    guests,
    propertyType,
    minRating,
    sortBy
  };

  for (const [key, value] of Object.entries(filters)) {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'all' &&
      Number.isFinite(Number(value))
    ) {
      params.set(key, String(value));
    } else if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'all' &&
      !['minPrice', 'maxPrice', 'guests', 'minRating'].includes(key)
    ) {
      params.set(key, String(value));
    }
  }

  if (Array.isArray(amenities) && amenities.length > 0) {
    params.set('amenities', amenities.join(','));
  }

  const query = params.toString();
  return `/listings${query ? `?${query}` : ''}`;
};

export const fetchListings = (filters = {}) =>
  apiClient.get(buildListingQuery(filters));

export const fetchListingById = (id) =>
  apiClient.get(`/listings/${encodeURIComponent(id)}`);

export const createListing = (listing) =>
  apiClient.post('/listings', listing);

export const fetchUserListings = () =>
  apiClient.get('/listings/host/my-listings');

export const deleteUserListing = (id) =>
  apiClient.delete(`/listings/${encodeURIComponent(id)}`);

export const fetchCategories = () =>
  apiClient.get('/listings/categories');

export const fetchDestinations = () =>
  apiClient.get('/listings/destinations');

export default {
  fetchListings,
  fetchListingById,
  createListing,
  fetchUserListings,
  deleteUserListing,
  fetchCategories,
  fetchDestinations
};
