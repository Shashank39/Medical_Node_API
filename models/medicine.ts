import mongoose, { Schema } from 'mongoose';
import { OrderItem } from './order';

export interface Medicine extends OrderItem{
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  manufacturer: string;
  expirationDate: Date;
  price: number;
  stock: number;
  image?: string;
  rating?: string;
  createdAt: Date;
  updatedAt: Date;
}

const medicineSchema: Schema<Medicine> = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  rating: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const MedicineModel = mongoose.model<Medicine>('Medicine', medicineSchema);
export default MedicineModel;
