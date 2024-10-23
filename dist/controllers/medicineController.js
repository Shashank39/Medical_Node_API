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
exports.incrementStock = exports.deleteMedicine = exports.updateMedicine = exports.createMedicine = exports.getMedicineById = exports.getMedicines = void 0;
const inventory_1 = __importDefault(require("../models/inventory"));
const medicine_1 = __importDefault(require("../models/medicine"));
// Get all medicines
const getMedicines = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medicines = yield medicine_1.default.find();
        return res.json(medicines);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});
exports.getMedicines = getMedicines;
// Get medicine by ID
const getMedicineById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medicine = yield medicine_1.default.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ msg: "Medicine not found" });
        }
        return res.json(medicine);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});
exports.getMedicineById = getMedicineById;
// Create a new medicine
const createMedicine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, manufacturer, expirationDate, price, stock, image, rating } = req.body;
    try {
        const newMedicine = new medicine_1.default({
            name,
            description,
            manufacturer,
            expirationDate,
            price,
            stock,
            image,
            rating,
        });
        const medicine = yield newMedicine.save();
        const newInventory = new inventory_1.default({
            productId: medicine._id,
            stock,
            threshold: 10,
        });
        yield newInventory.save();
        return res.json({ medicine, inventory: newInventory });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});
exports.createMedicine = createMedicine;
const updateMedicine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let medicine = yield medicine_1.default.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ msg: "Medicine not found" });
        }
        medicine = yield medicine_1.default.findByIdAndUpdate(req.params.id, { $set: medicineFields }, { new: true });
        return res.json(medicine);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});
exports.updateMedicine = updateMedicine;
const deleteMedicine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let medicine = yield medicine_1.default.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ msg: "Medicine not found" });
        }
        yield medicine_1.default.findByIdAndDelete(req.params.id);
        return res.json({ msg: "Medicine removed" });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});
exports.deleteMedicine = deleteMedicine;
const incrementStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const { stock } = req.body;
    if (!Number.isInteger(stock)) {
        return res.status(400).json({ msg: 'Quantity must be an integer' });
    }
    try {
        const product = yield medicine_1.default.findByIdAndUpdate(productId, { $inc: { stock: stock } }, { new: true });
        if (!product) {
            return res.status(404).json({ msg: 'Medicine not found' });
        }
        return res.json(product);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});
exports.incrementStock = incrementStock;
//# sourceMappingURL=medicineController.js.map