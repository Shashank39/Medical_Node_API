import mongoose, {Schema } from 'mongoose';

interface User{
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  addresses: mongoose.Types.ObjectId[];
  shopName?: string; 
}

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  shopName: {
    type: String,
  },
});

const UserModel = mongoose.model<User>('User', UserSchema);
export default UserModel;
