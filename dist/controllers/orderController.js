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
exports.deleteOrder = exports.updateOrderStatus = exports.getOrderById = exports.getOrderByOrderId = exports.getOrders = exports.createOrder = exports.addOrder = void 0;
const cart_1 = __importDefault(require("../models/cart"));
const medicine_1 = __importDefault(require("../models/medicine"));
const order_1 = __importDefault(require("../models/order"));
const user_1 = __importDefault(require("../models/user"));
const address_1 = __importDefault(require("../models/address"));
// Add Order
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, items, totalAmount, addressId } = req.body;
    try {
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const address = yield address_1.default.findById(addressId);
        if (!address) {
            return res.status(404).json({ msg: 'Address not found' });
        }
        const orderMedicines = [];
        let calculatedTotalAmount = 0;
        for (const item of items) {
            const medicine = yield medicine_1.default.findById(item.product);
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
        const newOrder = new order_1.default({
            user: userId,
            address: addressId,
            products: orderMedicines,
            totalAmount: totalAmount,
            status: 'pending',
            items: items
        });
        yield newOrder.save();
        yield cart_1.default.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0 });
        return res.status(201).json({ msg: 'Order placed successfully', order: newOrder });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});
exports.addOrder = addOrder;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const medicine = yield medicine_1.default.findById(medicineId);
            if (!medicine) {
                return res.status(404).json({ msg: `Medicine not found: ${medicineId}` });
            }
            if (medicine.stock < quantity) {
                return res.status(400).json({ msg: `Not enough stock for medicine: ${medicine.name}` });
            }
            totalAmount += medicine.price * quantity;
            medicine.stock -= quantity;
            yield medicine.save();
        }
        const order = new order_1.default({
            user: userId,
            items,
            totalAmount,
            status: 'pending',
            orderDate: new Date(),
        });
        yield order.save();
        yield clearCart(userId);
        return res.status(200).json(order);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});
exports.createOrder = createOrder;
const clearCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cart_1.default.deleteMany({ user: userId });
        console.log('Cart cleared successfully');
    }
    catch (error) {
        console.error('Error clearing cart:', error);
    }
});
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find()
            .populate('user', 'name email address phone')
            .populate({
            path: 'items.product',
            select: 'name brand price description category',
        });
        return res.json(orders);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});
exports.getOrders = getOrders;
const getOrderByOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        const order = yield order_1.default.findById(orderId)
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
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});
exports.getOrderByOrderId = getOrderByOrderId;
// Get Order By ID
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_1.default.findById(req.params.id)
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
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});
exports.getOrderById = getOrderById;
// Update Order Status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    try {
        let order = yield order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        order.status = status;
        yield order.save();
        return res.json(order);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});
exports.updateOrderStatus = updateOrderStatus;
// Delete Order
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let order = yield order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        yield order_1.default.findByIdAndDelete(req.params.id);
        return res.json({ msg: 'Order removed' });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});
exports.deleteOrder = deleteOrder;
//# sourceMappingURL=orderController.js.map