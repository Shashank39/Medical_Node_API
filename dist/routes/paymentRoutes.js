"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const payment_1 = require("../controllers/payment");
const router = express_1.default.Router();
router.post('/makePayment', authMiddleware_1.default, payment_1.makePayment);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map