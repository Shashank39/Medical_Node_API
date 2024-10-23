import mongoose, { Document, Schema } from 'mongoose';

interface Otp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema: Schema<Otp> = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const OtpModel = mongoose.model<Otp>('Otp', otpSchema);
export default OtpModel;
