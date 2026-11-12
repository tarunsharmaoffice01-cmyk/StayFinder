import { Router } from 'express';
import listingController from '../controllers/listingController.js';
import reviewRoutes from './reviewRoutes.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateCreateListing } from '../middleware/validateMiddleware.js';

const router = Router();

// Sub-route for property reviews
router.use('/:id/reviews', reviewRoutes);

// Metadata endpoints
router.get('/categories', listingController.getCategories);
router.get('/destinations', listingController.getDestinations);

// Host specific listings route
router.get('/host/my-listings', protect, authorize('host'), listingController.getUserListings);

// Core listing CRUD
router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);
router.post('/', protect, authorize('host'), validateCreateListing, listingController.createListing);
router.delete('/:id', protect, authorize('host'), listingController.deleteUserListing);
router.post('/:id/delete', protect, authorize('host'), listingController.deleteUserListing);

export default router;
