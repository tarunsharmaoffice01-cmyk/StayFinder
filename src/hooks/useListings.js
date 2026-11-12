import { useState, useEffect, useCallback } from 'react';
import { fetchListings } from '../services/listingService';

export const useListings = (filterParams = {}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchListings(filterParams);
      setListings(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load property listings');
    } finally {
      setLoading(false);
    }
  }, [
    filterParams.destination,
    filterParams.category,
    filterParams.minPrice,
    filterParams.maxPrice,
    filterParams.guests,
    filterParams.propertyType,
    filterParams.minRating,
    filterParams.sortBy,
    JSON.stringify(filterParams.amenities)
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    listings,
    loading,
    error,
    refetch: loadData
  };
};

export default useListings;

