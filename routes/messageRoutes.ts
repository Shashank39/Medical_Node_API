import express, { Request, Response } from 'express';
import { getInTouch } from '../controllers/messageController';

const router = express.Router();

router.post('/contact', async (req: Request, res: Response) => {
  try {
    await getInTouch(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
