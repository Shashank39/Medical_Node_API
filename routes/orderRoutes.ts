import express, { Request, Response } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  addOrder,
  getOrderByOrderId,
} from '../controllers/orderController';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.post('/add', authMiddleware, addOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), updateOrderStatus);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteOrder);
// Uncomment the line below if you want to enable this route
// router.get('/orderDetails/:id', authMiddleware, getOrderByOrderId);

export default router;
