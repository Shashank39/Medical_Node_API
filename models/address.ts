import mongoose, {Schema } from 'mongoose';

export interface IAddress {
  houseNo?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
  user: mongoose.Schema.Types.ObjectId;
}
const addressSchema: Schema<IAddress> = new Schema({
  houseNo: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  phone: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<IAddress>('Address', addressSchema);
