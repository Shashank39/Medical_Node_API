import express, { Request, Response } from 'express';
import { register, login } from '../controllers/authController'
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/admin', authMiddleware, roleMiddleware(['admin']), (req: Request, res: Response) => {
  res.send('Admin content');
});

router.get('/user', authMiddleware, roleMiddleware(['user', 'admin']), (req: Request, res: Response) => {
  res.send('User content');
});

export default router;
