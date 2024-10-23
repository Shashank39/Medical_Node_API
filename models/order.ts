import mongoose, {Schema } from 'mongoose';
import { Medicine } from './medicine';

export interface OrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  name?: string;
  manufacturer?: string; 
  price?: number;
}

interface Order{
  user: mongoose.Types.ObjectId;
  address: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  createdAt: Date;
}

const OrderSchema: Schema<Order> = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OrderModel = mongoose.model<Order>('Order', OrderSchema);
export default OrderModel;
