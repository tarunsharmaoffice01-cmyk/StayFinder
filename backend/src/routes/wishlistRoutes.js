import { Router } from 'express';
import wishlistController from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/', wishlistController.getWishlist);
router.put('/:propertyId', wishlistController.addToWishlist);
router.delete('/:propertyId', wishlistController.removeFromWishlist);

export default router;
