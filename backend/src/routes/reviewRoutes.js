import { Router } from 'express';
import reviewController from '../controllers/reviewController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validateCreateReview } from '../middleware/validateMiddleware.js';

// Router with mergeParams enabled so :id is accessible from /api/listings/:id/reviews
const router = Router({ mergeParams: true });

router.get('/', reviewController.getPropertyReviews);
router.post('/', optionalAuth, validateCreateReview, reviewController.addReview);

export default router;
