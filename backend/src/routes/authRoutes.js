import { Router } from 'express';
import authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateSignup, validateLogin, validateUpdateProfile } from '../middleware/validateMiddleware.js';

const router = Router();

router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, validateUpdateProfile, authController.updateProfile);

export default router;
