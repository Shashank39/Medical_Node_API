import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  incrementStock,
} from '../controllers/medicineController';

const router = express.Router();

router.get('/', getMedicines);
router.get('/:id', getMedicineById);
router.post('/', authMiddleware, roleMiddleware(['admin']), createMedicine);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateMedicine);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteMedicine);
router.put('/increment-stock/:productId', authMiddleware, roleMiddleware(['admin']), incrementStock);

export default router;
