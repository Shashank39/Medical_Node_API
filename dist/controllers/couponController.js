"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponStatus = exports.updateCoupon = exports.getCouponById = exports.viewCoupons = exports.applyCoupon = exports.createCoupon = void 0;
const coupon_1 = __importDefault(require("../models/coupon")); // Assuming the Coupon model is defined correctly
// Create a new coupon
const createCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, discountPercentage, expireDate } = req.body;
    try {
        const existingCoupon = yield coupon_1.default.findOne({ name });
        if (existingCoupon) {
            res.status(400).json({ msg: 'Coupon with this name already exists' });
            return;
        }
        const newCoupon = new coupon_1.default({
            name,
            discountPercentage,
            expireDate,
        });
        yield newCoupon.save();
        res.json({ msg: 'Coupon created successfully', coupon: newCoupon });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error });
    }
});
exports.createCoupon = createCoupon;
// Apply a coupon
const applyCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { couponName, totalPrice } = req.body;
    try {
        const coupon = yield coupon_1.default.findOne({ name: couponName });
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
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});
exports.applyCoupon = applyCoupon;
// View available coupons
const viewCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupons = yield coupon_1.default.find({ expireDate: { $gte: new Date() } });
        if (coupons.length === 0) {
            res.status(404).json({ msg: 'No coupons available' });
            return;
        }
        res.json({
            msg: 'Available coupons retrieved successfully',
            coupons,
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});
exports.viewCoupons = viewCoupons;
// Get coupon by ID
const getCouponById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const couponId = req.params.id;
        const coupon = yield coupon_1.default.findById(couponId);
        if (!coupon) {
            res.status(404).json({ msg: 'Coupon not found' });
            return;
        }
        res.status(200).json(coupon);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});
exports.getCouponById = getCouponById;
// Update a coupon
const updateCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const couponId = req.params.id;
        const { name, discountPercentage, expireDate, isActive } = req.body;
        let coupon = yield coupon_1.default.findById(couponId);
        if (!coupon) {
            res.status(404).json({ msg: 'Coupon not found' });
            return;
        }
        coupon.name = name || coupon.name;
        coupon.discountPercentage = discountPercentage || coupon.discountPercentage;
        coupon.expireDate = expireDate || coupon.expireDate;
        coupon.isActive = typeof isActive === 'boolean' ? isActive : coupon.isActive;
        yield coupon.save();
        res.status(200).json({ msg: 'Coupon updated successfully', coupon });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});
exports.updateCoupon = updateCoupon;
// Change coupon status
const couponStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const couponId = req.params.id;
        const { isActive } = req.body;
        let coupon = yield coupon_1.default.findById(couponId);
        if (!coupon) {
            res.status(404).json({ msg: 'Coupon not found' });
            return;
        }
        coupon.isActive = isActive;
        yield coupon.save();
        const allCoupons = yield coupon_1.default.find();
        const action = isActive ? 'activated' : 'deactivated';
        res.status(200).json({
            msg: `Coupon ${action} successfully`,
            allCoupons
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});
exports.couponStatus = couponStatus;
//# sourceMappingURL=couponController.js.map