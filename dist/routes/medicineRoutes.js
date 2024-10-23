"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const medicineController_1 = require("../controllers/medicineController");
const router = express_1.default.Router();
router.get('/', medicineController_1.getMedicines);
router.get('/:id', medicineController_1.getMedicineById);
router.post('/', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin']), medicineController_1.createMedicine);
router.put('/:id', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin']), medicineController_1.updateMedicine);
router.delete('/:id', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin']), medicineController_1.deleteMedicine);
router.put('/increment-stock/:productId', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin']), medicineController_1.incrementStock);
exports.default = router;
//# sourceMappingURL=medicineRoutes.js.map