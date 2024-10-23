import mongoose, { Schema } from 'mongoose';

interface Message  {
  name: string;
  email: string;
  message: string;
  phone: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message: (props: { value: string }) => `${props.value} is not a valid email!`,
    },
  },
  message: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MessageModel = mongoose.model<Message>('Message', MessageSchema);
export default MessageModel;
