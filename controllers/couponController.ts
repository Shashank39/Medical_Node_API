import { Request, Response } from 'express';
import Coupon from '../models/coupon'; // Assuming the Coupon model is defined correctly

// Create a new coupon
export const createCoupon = async (req: Request, res: Response): Promise<void> => {
    const { name, discountPercentage, expireDate } = req.body;

    try {
        const existingCoupon = await Coupon.findOne({ name });
        if (existingCoupon) {
            res.status(400).json({ msg: 'Coupon with this name already exists' });
            return;
        }

        const newCoupon = new Coupon({
            name,
            discountPercentage,
            expireDate,
        });

        await newCoupon.save();
        res.json({ msg: 'Coupon created successfully', coupon: newCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error });
    }
};

// Apply a coupon
export const applyCoupon = async (req: Request, res: Response): Promise<void> => {
    const { couponName, totalPrice } = req.body;

    try {
        const coupon = await Coupon.findOne({ name: couponName });

        if (!coupon) {
            res.status(404).json({ msg: 'Coupon not found' });
            return;
        }

        const currentDate = new Date();
        if (currentDate > coupon.expireDate) {
            res.status(400).json({ msg: 'Coupon has expired' });
            return;
        }

        const discount = (coupon.discountPercentage / 100) * totalPrice;
        const discountedPrice = totalPrice - discount;

        res.json({
            msg: 'Coupon applied successfully',
            originalPrice: totalPrice,
            discountedPrice,
            discountPercentage: coupon.discountPercentage,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// View available coupons
export const viewCoupons = async (req: Request, res: Response): Promise<void> => {
    try {
        const coupons = await Coupon.find({ expireDate: { $gte: new Date() } });

        if (coupons.length === 0) {
            res.status(404).json({ msg: 'No coupons available' });
            return;
        }

        res.json({
            msg: 'Available coupons retrieved successfully',
            coupons,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get coupon by ID
export const getCouponById = async (req: Request, res: Response): Promise<void> => {
    try {
        const couponId = req.params.id;

        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            res.status(404).json({ msg: 'Coupon not found' });
            return;
        }

        res.status(200).json(coupon);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update a coupon
export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
        const couponId = req.params.id;
        const { name, discountPercentage, expireDate, isActive } = req.body;

        let coupon = await Coupon.findById(couponId);
        if (!coupon) {
            res.status(404).json({ msg: 'Coupon not found' });
            return;
        }

        coupon.name = name || coupon.name;
        coupon.discountPercentage = discountPercentage || coupon.discountPercentage;
        coupon.expireDate = expireDate || coupon.expireDate;
        coupon.isActive = typeof isActive === 'boolean' ? isActive : coupon.isActive;

        await coupon.save();

        res.status(200).json({ msg: 'Coupon updated successfully', coupon });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Change coupon status
export const couponStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const couponId = req.params.id;
        const { isActive } = req.body;

        let coupon = await Coupon.findById(couponId);
        if (!coupon) {
            res.status(404).json({ msg: 'Coupon not found' });
            return;
        }

        coupon.isActive = isActive;
        await coupon.save();

        const allCoupons = await Coupon.find();

        const action = isActive ? 'activated' : 'deactivated';
        res.status(200).json({
            msg: `Coupon ${action} successfully`,
            allCoupons
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
