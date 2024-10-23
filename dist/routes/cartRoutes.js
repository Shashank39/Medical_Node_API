"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const cartController_1 = require("../controllers/cartController");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.default, cartController_1.addToCart);
router.get('/', authMiddleware_1.default, cartController_1.getCart);
router.delete('/:medicalId', authMiddleware_1.default, cartController_1.removeFromCart);
router.put('/update-quantity', authMiddleware_1.default, cartController_1.updateCartQuantity);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map