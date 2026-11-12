import { Router } from 'express';
import bookingController from '../controllers/bookingController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validateCreateBooking } from '../middleware/validateMiddleware.js';

const router = Router();

router.post('/', optionalAuth, validateCreateBooking, bookingController.createBooking);
router.get('/', optionalAuth, bookingController.getUserBookings);
router.get('/:id', optionalAuth, bookingController.getBookingById);
router.delete('/:id', optionalAuth, bookingController.cancelBooking);
router.patch('/:id/cancel', optionalAuth, bookingController.cancelBooking);

export default router;
