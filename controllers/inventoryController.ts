import { Request, Response } from 'express';
import Inventory from '../models/inventory';
import Medicine from '../models/medicine'; 

export const getInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const inventory = await Inventory.find().populate('productId');
        res.json(inventory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


export const updateStock = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;
    const { stock } = req.body;

    if (!Number.isInteger(stock)) {
        res.status(400).json({ msg: 'Quantity must be an integer' });
        return;
    }

    try {
  
        let inventory = await Inventory.findOne({ productId });

        if (!inventory) {
            res.status(404).json({ msg: 'Product not found in inventory' });
            return;
        }

        inventory.stock = stock;
        await inventory.save();

        let medicine = await Medicine.findById(productId);

        if (!medicine) {
            res.status(404).json({ msg: 'Product not found' });
            return;
        }

        medicine.stock = stock;
        await medicine.save();

        res.json({ inventory, medicine });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const getLowStock = async (req: Request, res: Response): Promise<void> => {
    const threshold = 10; 
    try {
        const lowStockItems = await Inventory.find({ stock: { $lte: threshold } }).populate('productId');
        res.json(lowStockItems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
