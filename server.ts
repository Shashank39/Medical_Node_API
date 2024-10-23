import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import medicineRoutes from './routes/medicineRoutes';
import orderRoutes from './routes/orderRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import cartRoutes from './routes/cartRoutes';
import couponRoutes from './routes/couponRoutes';
import messageRoutes from './routes/messageRoutes';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();

const app: Application = express();

const allowedOrigins: string[] = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://medical-api-git-main-ayush-saxenas-projects-03883bbf.vercel.app'
];

app.use(cors({
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/checkout', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
