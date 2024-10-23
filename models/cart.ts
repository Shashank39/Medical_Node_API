import mongoose, { Document, Schema, Types, Model } from 'mongoose';
import { Medicine } from '../models/medicine'; // Import the Medicine interface


export interface CartItem {
  product: Medicine;
  quantity: number; 
}

interface Cart extends Document {
  user: Types.ObjectId;
  items: CartItem[];
  totalAmount: number;
}

const CartSchema: Schema<Cart> = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
        min: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    default: 0,
  },
});

const CartModel: Model<Cart> = mongoose.model<Cart>('Cart', CartSchema);
export default CartModel;
