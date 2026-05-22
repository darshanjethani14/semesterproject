import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderAnalytics,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, admin, getOrderAnalytics);
router.get('/user', protect, getUserOrders);
router.get('/', protect, admin, getAllOrders);
router.post('/', protect, createOrder);
router.put('/:id', protect, admin, updateOrderStatus);

export default router;
