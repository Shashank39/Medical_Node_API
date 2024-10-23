"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const medicineRoutes_1 = __importDefault(require("./routes/medicineRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const inventoryRoutes_1 = __importDefault(require("./routes/inventoryRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://medical-api-git-main-ayush-saxenas-projects-03883bbf.vercel.app'
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
(0, db_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/medicines', medicineRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/inventory', inventoryRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
app.use('/api/coupons', couponRoutes_1.default);
app.use('/api/message', messageRoutes_1.default);
app.use('/api/checkout', paymentRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//# sourceMappingURL=server.js.map