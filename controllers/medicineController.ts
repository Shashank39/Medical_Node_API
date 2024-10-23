import { Request, Response } from 'express';
import Inventory from '../models/inventory';
import Medicine ,{ Medicine as MedicineType } from '../models/medicine';

// Get all medicines
export const getMedicines = async (req: Request, res: Response):Promise<Response<MedicineType[]>> => {
  try {
    const medicines = await Medicine.find();
    return res.json(medicines);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Get medicine by ID
export const getMedicineById = async (req: Request, res: Response): Promise<Response<MedicineType[]>> => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ msg: "Medicine not found" });
    }
    return res.json(medicine);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Create a new medicine
export const createMedicine = async (req: Request, res: Response):Promise<Response<MedicineType[]>> => {
  const { name, description, manufacturer, expirationDate, price, stock, image, rating } = req.body;

  try {
    const newMedicine = new Medicine({
      name,
      description, 
      manufacturer,
      expirationDate,
      price,
      stock,
      image,
      rating,
    });

    const medicine = await newMedicine.save();

    const newInventory = new Inventory({
      productId: medicine._id,
      stock,
      threshold: 10,
    });
    await newInventory.save();

    return res.json({ medicine, inventory: newInventory });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

export const updateMedicine = async (req: Request, res: Response):Promise<Response<MedicineType[]>> => {
  const { name, description, manufacturer, expirationDate, price, image, rating, stock } = req.body;

  const medicineFields = {
    name,
    description,
    manufacturer,
    expirationDate,
    price,
    image,
    rating,
    stock,
  };

  try {
    let medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ msg: "Medicine not found" });
    }

    medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $set: medicineFields },
      { new: true }
    );
    return res.json(medicine);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

export const deleteMedicine = async (req: Request, res: Response):Promise<Response<MedicineType[]>> => {
  try {
    let medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ msg: "Medicine not found" });
    }

    await Medicine.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Medicine removed" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

export const incrementStock = async (req: Request, res: Response):Promise<Response<MedicineType[]>>=> {
  const { productId } = req.params;
  const { stock } = req.body;

  if (!Number.isInteger(stock)) {
    return res.status(400).json({ msg: 'Quantity must be an integer' });
  }

  try {
    
    const product = await Medicine.findByIdAndUpdate(
      productId,
      { $inc: { stock: stock } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ msg: 'Medicine not found' });
    }

    return res.json(product);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};
