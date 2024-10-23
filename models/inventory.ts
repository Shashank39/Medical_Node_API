import mongoose, {Schema } from 'mongoose';

interface Inventory{
  productId: mongoose.Types.ObjectId;
  stock: number;
  threshold: number;
}

const InventorySchema: Schema<Inventory> = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  threshold: {
    type: Number,
    default: 10,
  },
});

const InventoryModel = mongoose.model<Inventory>('Inventory', InventorySchema);
export default InventoryModel;
