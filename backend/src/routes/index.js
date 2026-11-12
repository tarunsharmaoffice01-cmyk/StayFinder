import { Router } from 'express';
import authRoutes from './authRoutes.js';
import listingRoutes from './listingRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import adminRoutes from './adminRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';

const router = Router();

// Authentication
router.use('/auth', authRoutes);

// Hotel / Vacation rental listings
router.use('/listings', listingRoutes);

// Bookings & Reservations
router.use('/bookings', bookingRoutes);

// Admin Management
router.use('/admin', adminRoutes);
router.use('/wishlist', wishlistRoutes);

export default router;
