import { Router } from 'express';
import listingController from '../controllers/listingController.js';
import reviewRoutes from './reviewRoutes.js';
import { protect, optionalAuth, authorize } from '../middleware/authMiddleware.js';
import { validateCreateListing } from '../middleware/validateMiddleware.js';

const router = Router();

// Sub-route for property reviews
router.use('/:id/reviews', reviewRoutes);

// Metadata endpoints
router.get('/categories', listingController.getCategories);
router.get('/destinations', listingController.getDestinations);

// Host specific listings route
router.get('/host/my-listings', optionalAuth, listingController.getUserListings);

// Core listing CRUD
router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);
router.post('/', optionalAuth, validateCreateListing, listingController.createListing);
router.delete('/:id', optionalAuth, listingController.deleteUserListing);
router.post('/:id/delete', optionalAuth, listingController.deleteUserListing);

export default router;
