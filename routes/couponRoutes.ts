import express, { Request, Response } from 'express';
import { createCoupon, applyCoupon, viewCoupons, getCouponById, updateCoupon, couponStatus } from '../controllers/couponController';

const router = express.Router();

router.post('/create', createCoupon);
router.post('/applyCoupon', applyCoupon);
router.get('/viewCoupon', viewCoupons);
router.get('/:id', getCouponById);
router.put('/updateCoupons/:id', updateCoupon);
router.put('/changeStatus/:id', couponStatus);

export default router;
