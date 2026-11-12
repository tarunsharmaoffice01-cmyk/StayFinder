import { Router } from 'express';
import bookingController from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateCreateBooking } from '../middleware/validateMiddleware.js';

const router = Router();

router.use(protect);
router.post('/', validateCreateBooking, bookingController.createBooking);
router.get('/', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.delete('/:id', bookingController.cancelBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);

export default router;
