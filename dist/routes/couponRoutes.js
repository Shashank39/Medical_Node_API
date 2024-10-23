"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couponController_1 = require("../controllers/couponController");
const router = express_1.default.Router();
router.post('/create', couponController_1.createCoupon);
router.post('/applyCoupon', couponController_1.applyCoupon);
router.get('/viewCoupon', couponController_1.viewCoupons);
router.get('/:id', couponController_1.getCouponById);
router.put('/updateCoupons/:id', couponController_1.updateCoupon);
router.put('/changeStatus/:id', couponController_1.couponStatus);
exports.default = router;
//# sourceMappingURL=couponRoutes.js.map