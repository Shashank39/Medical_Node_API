import express, { Request, Response } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { removeFromCart, getCart, addToCart, updateCartQuantity } from '../controllers/cartController';

const router = express.Router();

router.post('/', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.delete('/:medicalId', authMiddleware, removeFromCart);
router.put('/update-quantity', authMiddleware, updateCartQuantity);

export default router;
