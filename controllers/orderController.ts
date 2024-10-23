import { Request, Response } from 'express';
import Cart from '../models/cart';
import Medicine, { Medicine as MedicineType } from '../models/medicine';
import Order, { OrderItem } from '../models/order';
import User from '../models/user';
import Address from '../models/address';
import mongoose from 'mongoose';

// Add Order
export const addOrder = async (req: Request, res: Response): Promise<Response> => {
  const { userId, items, totalAmount, addressId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ msg: 'Address not found' });
    }
    const orderMedicines: OrderItem[] = [];
    let calculatedTotalAmount = 0;

    for (const item of items) {
      const medicine = await Medicine.findById(item.product);
      if (!medicine) {
        return res.status(404).json({ msg: `Medicine with ID ${item.product} not found` });
      }
      calculatedTotalAmount += medicine.price * item.quantity;
      orderMedicines.push({
        product: medicine._id,
        name: medicine.name,
        manufacturer: medicine.manufacturer,
        quantity: item.quantity,
        price: medicine.price,
      });
    }
    if (totalAmount !== calculatedTotalAmount) {
      return res.status(400).json({ msg: 'Total amount mismatch' });
    }
    const newOrder = new Order({
      user: userId,
      address: addressId,
      products: orderMedicines,
      totalAmount: totalAmount,
      status: 'pending',
      items: items
    });

    await newOrder.save();

    await Cart.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0 });

    return res.status(201).json({ msg: 'Order placed successfully', order: newOrder });

  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

export const createOrder = async (req: Request, res: Response): Promise<Response> => {
  const { userId, items } = req.body;

  if (!userId) {
    return res.status(400).json({ msg: 'User ID is required' });
  }

  let totalAmount = 0;

  try {
    for (let i = 0; i < items.length; i++) {
      const medicineId = items[i].product;
      let quantity = parseInt(items[i].quantity, 10);

      if (isNaN(quantity)) {
        return res.status(400).json({ msg: `Invalid quantity for medicine: ${medicineId}` });
      }

      const medicine = await Medicine.findById(medicineId);

      if (!medicine) {
        return res.status(404).json({ msg: `Medicine not found: ${medicineId}` });
      }

      if (medicine.stock < quantity) {
        return res.status(400).json({ msg: `Not enough stock for medicine: ${medicine.name}` });
      }
      totalAmount += medicine.price * quantity;
      medicine.stock -= quantity;
      await medicine.save();
    }
    const order = new Order({
      user: userId,
      items,
      totalAmount,
      status: 'pending',
      orderDate: new Date(),
    });

    await order.save();
    await clearCart(userId);
    return res.status(200).json(order);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

const clearCart = async (userId: string): Promise<void> => {
  try {
    await Cart.deleteMany({ user: userId });
    console.log('Cart cleared successfully');
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

export const getOrders = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email address phone') 
      .populate({
        path: 'items.product',
        select: 'name brand price description category', 
      });

    return res.json(orders);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

export const getOrderByOrderId = async (req: Request, res: Response): Promise<Response> => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate({
        path: 'user',
        select: 'name email shopName', 
      })
      .populate({
        path: 'address',
        select: 'houseNo street city state postalCode phone', 
      })
      .populate({
        path: 'items.product',
        select: 'name manufacturer price image', 
      });

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// Get Order By ID
export const getOrderById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name manufacturer price image')
      .populate({
        path: 'address',
        select: 'houseNo street city state postalCode phone',
      });

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    return res.json(order);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// Update Order Status
export const updateOrderStatus = async (req: Request, res: Response): Promise<Response> => {
  const { status } = req.body;

  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.status = status;
    await order.save();
    return res.json(order);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// Delete Order
export const deleteOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    await Order.findByIdAndDelete(req.params.id);
    return res.json({ msg: 'Order removed' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};
