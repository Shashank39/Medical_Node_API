import mongoose, {Schema } from 'mongoose';

interface Coupon{
  name: string;
  discountPercentage: number; 
  expireDate: Date; 
  createdAt: Date; 
  isActive: boolean; 
}

const couponSchema: Schema<Coupon> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  expireDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const CouponModel = mongoose.model<Coupon>('Coupon', couponSchema);
export default CouponModel;
