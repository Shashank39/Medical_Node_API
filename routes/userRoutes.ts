import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import {
  getUserDetails,
  updateUserDetails,
  deleteUser,
  logout,
  changePassword,
  getAllUsers,
  addAddress,
  deleteAddress,
  updateAddress,
} from '../controllers/userController';
import {
  verifyOtpAndChangePassword,
  forgotPassword,
} from '../controllers/authController';

const router = express.Router();

router.get('/logout', authMiddleware, logout);
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'user']), getUserDetails);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'user']), updateUserDetails);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);
router.put('/change-password', authMiddleware, changePassword);
router.post('/add-address', authMiddleware, addAddress);
router.post('/update-address', authMiddleware, updateAddress);
router.delete('/delete-address/:userId/:addressId', authMiddleware, deleteAddress);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', verifyOtpAndChangePassword);

export default router;
