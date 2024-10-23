"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.default, orderController_1.createOrder);
router.post('/add', authMiddleware_1.default, orderController_1.addOrder);
router.get('/', authMiddleware_1.default, orderController_1.getOrders);
router.get('/:id', authMiddleware_1.default, orderController_1.getOrderById);
router.put('/:id/status', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin']), orderController_1.updateOrderStatus);
router.delete('/:id', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin']), orderController_1.deleteOrder);
// Uncomment the line below if you want to enable this route
// router.get('/orderDetails/:id', authMiddleware, getOrderByOrderId);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map