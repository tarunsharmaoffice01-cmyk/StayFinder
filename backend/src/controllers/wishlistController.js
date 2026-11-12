import {
  addWishlistItem,
  deleteWishlistItem,
  getWishlistByUser
} from '../../db/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { unwrapDbResult } from '../utils/unwrapDbResult.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const items = unwrapDbResult(
    await getWishlistByUser(req.user.id),
    'loading wishlist'
  );
  res.status(200).json({ success: true, count: items.length, data: items });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const item = unwrapDbResult(
    await addWishlistItem(req.user.id, req.params.propertyId),
    'saving wishlist item'
  );
  res.status(201).json({ success: true, data: item });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  unwrapDbResult(
    await deleteWishlistItem(req.user.id, req.params.propertyId),
    'removing wishlist item'
  );
  res.status(200).json({ success: true, propertyId: req.params.propertyId });
});

export default { getWishlist, addToWishlist, removeFromWishlist };
