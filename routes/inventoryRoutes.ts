import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import { getInventory, updateStock, getLowStock } from '../controllers/inventoryController';

const router = express.Router();

router.get('/', authMiddleware, getInventory);
router.put('/:productId', authMiddleware, roleMiddleware(['admin']), updateStock);
router.get('/low-stock', authMiddleware, getLowStock);

export default router;
