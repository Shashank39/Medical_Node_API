import express, { Request, Response } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { makePayment } from '../controllers/payment';

const router = express.Router();

router.post('/makePayment', authMiddleware, makePayment);

export default router;
