import { Request, Response } from 'express';
import Cart, { CartItem }  from '../models/cart';
import Medicine from '../models/medicine';

interface AuthenticatedRequest extends Request {
    user: {
      id: string;
    };
  }

async function calculateTotalAmount(items: CartItem[]): Promise<number> {
  let total = 0;
  for (const item of items) {
   
    const product = await Medicine.findById(item.product);
    if (product) {
      total += item.quantity * product.price;
    }
  }
  return total;
}

// Add item to cart
export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  const { medicineId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === medicineId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: medicineId, quantity });
    }

    const medicineIds = cart.items.map(item => item.product);
    const medicines = await Medicine.find({ _id: { $in: medicineIds } });

    cart.totalAmount = cart.items.reduce((total, item) => {
      const itemMedicine = medicines.find(med => med._id.toString() === item.product.toString());
      return total + (itemMedicine ? itemMedicine.price * item.quantity : 0);
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get cart items
export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(200).json({ msg: 'Cart is empty' });
    }

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Remove item from cart
export const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
  const { medicalId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => (item.product?._id.toString()) === medicalId);
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);

      cart.totalAmount = cart.items.reduce((acc, item) => acc + item.quantity * (item.product.price), 0);

      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ msg: 'Item not found in cart' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update cart item quantity
export const updateCartQuantity = async (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  if (quantity < 1) {
    req.params.productId = productId;
    return removeFromCart(req, res);
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;

    cart.totalAmount = await calculateTotalAmount(cart.items);

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
