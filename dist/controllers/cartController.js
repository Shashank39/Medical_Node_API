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
exports.updateCartQuantity = exports.removeFromCart = exports.getCart = exports.addToCart = void 0;
const cart_1 = __importDefault(require("../models/cart"));
const medicine_1 = __importDefault(require("../models/medicine"));
function calculateTotalAmount(items) {
    return __awaiter(this, void 0, void 0, function* () {
        let total = 0;
        for (const item of items) {
            const product = yield medicine_1.default.findById(item.product);
            if (product) {
                total += item.quantity * product.price;
            }
        }
        return total;
    });
}
// Add item to cart
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { medicineId, quantity } = req.body;
    const userId = req.user.id;
    try {
        let cart = yield cart_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new cart_1.default({ user: userId, items: [] });
        }
        const medicine = yield medicine_1.default.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === medicineId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        }
        else {
            cart.items.push({ product: medicineId, quantity });
        }
        const medicineIds = cart.items.map(item => item.product);
        const medicines = yield medicine_1.default.find({ _id: { $in: medicineIds } });
        cart.totalAmount = cart.items.reduce((total, item) => {
            const itemMedicine = medicines.find(med => med._id.toString() === item.product.toString());
            return total + (itemMedicine ? itemMedicine.price * item.quantity : 0);
        }, 0);
        yield cart.save();
        res.json(cart);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.addToCart = addToCart;
// Get cart items
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const cart = yield cart_1.default.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            return res.status(200).json({ msg: 'Cart is empty' });
        }
        res.json(cart);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.getCart = getCart;
// Remove item from cart
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { medicalId } = req.params;
    const userId = req.user.id;
    try {
        const cart = yield cart_1.default.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }
        const itemIndex = cart.items.findIndex(item => { var _a; return ((_a = item.product) === null || _a === void 0 ? void 0 : _a._id.toString()) === medicalId; });
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            cart.totalAmount = cart.items.reduce((acc, item) => acc + item.quantity * (item.product.price), 0);
            yield cart.save();
            res.json(cart);
        }
        else {
            res.status(404).json({ msg: 'Item not found in cart' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.removeFromCart = removeFromCart;
// Update cart item quantity
const updateCartQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    if (quantity < 1) {
        req.params.productId = productId;
        return (0, exports.removeFromCart)(req, res);
    }
    try {
        const cart = yield cart_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ msg: 'Item not found in cart' });
        }
        cart.items[itemIndex].quantity = quantity;
        cart.totalAmount = yield calculateTotalAmount(cart.items);
        yield cart.save();
        res.json(cart);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.updateCartQuantity = updateCartQuantity;
//# sourceMappingURL=cartController.js.map