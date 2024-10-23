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
exports.logout = exports.deleteAddress = exports.updateAddress = exports.addAddress = exports.changePassword = exports.deleteUser = exports.updateUserDetails = exports.getUserDetails = exports.getAllUsers = void 0;
const address_1 = __importDefault(require("../models/address")); // Assuming you're using a default export
const user_1 = __importDefault(require("../models/user")); // Assuming you're using a default export
const bcrypt_1 = __importDefault(require("bcrypt")); // Ensure bcrypt is imported
const tokenBlacklist_1 = require("../utils/tokenBlacklist");
// Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find().select('-password');
        return res.json(users);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});
exports.getAllUsers = getAllUsers;
// Get user details
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.params.id)
            .populate('addresses') // Populate the addresses field
            .select("-password"); // Exclude the password field
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        return res.json(user);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});
exports.getUserDetails = getUserDetails;
// Update user details
const updateUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, shopName } = req.body;
    const userFields = { name, email, shopName };
    try {
        let user = yield user_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        user = yield user_1.default.findByIdAndUpdate(req.params.id, { $set: userFields }, { new: true }).select("-password");
        return res.json(user);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});
exports.updateUserDetails = updateUserDetails;
// Delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        yield user_1.default.findByIdAndDelete(req.params.id);
        return res.json({ msg: "User removed" });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});
exports.deleteUser = deleteUser;
// Change password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = yield user_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        // Compare the current password with the stored password
        const isMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Current password is incorrect" });
        }
        // Directly set the new password from the frontend (assumed to be hashed)
        user.password = yield bcrypt_1.default.hash(newPassword, 10); // Hash the new password before saving
        yield user.save();
        return res.json({ msg: "Password changed successfully" });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});
exports.changePassword = changePassword;
// Add address
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, houseNo, street, city, state, postalCode } = req.body;
    try {
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const newAddress = new address_1.default({
            houseNo,
            street,
            city,
            state,
            postalCode,
            user: userId,
        });
        const savedAddress = yield newAddress.save();
        user.addresses.push(savedAddress._id);
        yield user.save();
        return res.json(savedAddress);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});
exports.addAddress = addAddress;
// Update address
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { houseNo, addressId, street, city, state, postalCode } = req.body;
    try {
        let address = yield address_1.default.findById(addressId);
        if (!address) {
            return res.status(404).json({ msg: 'Address not found' });
        }
        address.street = street || address.street;
        address.houseNo = houseNo || address.houseNo;
        address.city = city || address.city;
        address.state = state || address.state;
        address.postalCode = postalCode || address.postalCode;
        const updatedAddress = yield address.save();
        return res.json(updatedAddress);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});
exports.updateAddress = updateAddress;
// Delete address
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { addressId, userId } = req.params;
    try {
        const address = yield address_1.default.findById(addressId);
        if (!address) {
            return res.status(404).json({ msg: 'Address not found' });
        }
        yield address.deleteOne();
        const user = yield user_1.default.findByIdAndUpdate(userId, { $pull: { addresses: addressId } }, { new: true });
        return res.json({ msg: 'Address removed', addresses: user === null || user === void 0 ? void 0 : user.addresses });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});
exports.deleteAddress = deleteAddress;
// Logout
const logout = (req, res) => {
    const token = req.header("token");
    (0, tokenBlacklist_1.addToBlacklist)(token);
    return res.json({ msg: "User logged out" });
};
exports.logout = logout;
//# sourceMappingURL=userController.js.map