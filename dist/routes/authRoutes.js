"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const router = express_1.default.Router();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.get('/admin', authMiddleware_1.default, (0, roleMiddleware_1.default)(['admin']), (req, res) => {
    res.send('Admin content');
});
router.get('/user', authMiddleware_1.default, (0, roleMiddleware_1.default)(['user', 'admin']), (req, res) => {
    res.send('User content');
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map