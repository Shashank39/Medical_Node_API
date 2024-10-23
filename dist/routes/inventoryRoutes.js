"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const inventoryController_1 = require("../controllers/inventoryController");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.default, inventoryController_1.getInventory);
router.put('/:productId', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin']), inventoryController_1.updateStock);
router.get('/low-stock', authMiddleware_1.default, inventoryController_1.getLowStock);
exports.default = router;
//# sourceMappingURL=inventoryRoutes.js.map