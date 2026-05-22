import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  getUsers,
  toggleWishlist,
  getWishlist,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.get('/users', protect, admin, getUsers);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, toggleWishlist);

export default router;
