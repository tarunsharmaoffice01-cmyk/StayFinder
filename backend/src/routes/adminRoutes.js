import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Require authentication and 'admin' role for all admin routes
router.use(protect, authorize('admin'));

router.get('/stats', adminController.getStats);
router.get('/listings', adminController.getAllListings);
router.delete('/listings/:id', adminController.deleteListing);
router.get('/bookings', adminController.getAllBookings);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);

export default router;
