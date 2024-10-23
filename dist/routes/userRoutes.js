"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.get('/logout', authMiddleware_1.default, userController_1.logout);
router.get('/', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin']), userController_1.getAllUsers);
router.get('/:id', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin', 'user']), userController_1.getUserDetails);
router.put('/:id', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin', 'user']), userController_1.updateUserDetails);
router.delete('/:id', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin']), userController_1.deleteUser);
router.put('/change-password', authMiddleware_1.default, userController_1.changePassword);
router.post('/add-address', authMiddleware_1.default, userController_1.addAddress);
router.post('/update-address', authMiddleware_1.default, userController_1.updateAddress);
router.delete('/delete-address/:userId/:addressId', authMiddleware_1.default, userController_1.deleteAddress);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.verifyOtpAndChangePassword);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map