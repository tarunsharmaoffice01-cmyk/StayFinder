import listingService from '../services/listingService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllListings = asyncHandler(async (req, res) => {
  const { listings, total } = await listingService.getListings(req.query);
  res.status(200).json({
    success: true,
    count: listings.length,
    total,
    data: listings
  });
});

export const getListingById = asyncHandler(async (req, res) => {
  const listing = await listingService.getListingById(req.params.id);
  res.status(200).json({
    success: true,
    data: listing
  });
});

export const createListing = asyncHandler(async (req, res) => {
  const newListing = await listingService.createListing(req.body, req.user);
  res.status(201).json({
    success: true,
    message: 'Listing published successfully',
    data: newListing
  });
});

export const getUserListings = asyncHandler(async (req, res) => {
  const listings = await listingService.getUserListings(req.user.id);
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

export const deleteUserListing = asyncHandler(async (req, res) => {
  const result = await listingService.deleteUserListing(
    req.params.id,
    req.user.id,
    req.user.role
  );
  res.status(200).json(result);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await listingService.getCategories();
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

export const getDestinations = asyncHandler(async (req, res) => {
  const destinations = await listingService.getDestinations();
  res.status(200).json({
    success: true,
    count: destinations.length,
    data: destinations
  });
});

export default {
  getAllListings,
  getListingById,
  createListing,
  getUserListings,
  deleteUserListing,
  getCategories,
  getDestinations
};
