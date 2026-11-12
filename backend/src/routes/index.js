import { Router } from 'express';
import authRoutes from './authRoutes.js';
import listingRoutes from './listingRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import adminRoutes from './adminRoutes.js';
import listingController from '../controllers/listingController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Authentication
router.use('/auth', authRoutes);

// Hotel / Vacation rental listings
router.use('/listings', listingRoutes);

// Direct compatibility alias for frontend listingService: /api/user/listings
const userListingsRouter = Router();
userListingsRouter.get('/', optionalAuth, listingController.getUserListings);
userListingsRouter.delete('/:id', optionalAuth, listingController.deleteUserListing);
userListingsRouter.post('/:id/delete', optionalAuth, listingController.deleteUserListing);
router.use('/user/listings', userListingsRouter);

// Bookings & Reservations
router.use('/bookings', bookingRoutes);

// Admin Management
router.use('/admin', adminRoutes);

export default router;
