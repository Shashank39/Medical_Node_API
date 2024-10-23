"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowStock = exports.updateStock = exports.getInventory = void 0;
const inventory_1 = __importDefault(require("../models/inventory"));
const medicine_1 = __importDefault(require("../models/medicine"));
const getInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventory = yield inventory_1.default.find().populate('productId');
        res.json(inventory);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
exports.getInventory = getInventory;
const updateStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const { stock } = req.body;
    if (!Number.isInteger(stock)) {
        res.status(400).json({ msg: 'Quantity must be an integer' });
        return;
    }
    try {
        let inventory = yield inventory_1.default.findOne({ productId });
        if (!inventory) {
            res.status(404).json({ msg: 'Product not found in inventory' });
            return;
        }
        inventory.stock = stock;
        yield inventory.save();
        let medicine = yield medicine_1.default.findById(productId);
        if (!medicine) {
            res.status(404).json({ msg: 'Product not found' });
            return;
        }
        medicine.stock = stock;
        yield medicine.save();
        res.json({ inventory, medicine });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
exports.updateStock = updateStock;
const getLowStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const threshold = 10;
    try {
        const lowStockItems = yield inventory_1.default.find({ stock: { $lte: threshold } }).populate('productId');
        res.json(lowStockItems);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
exports.getLowStock = getLowStock;
//# sourceMappingURL=inventoryController.js.map