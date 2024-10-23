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
exports.verifyOtpAndChangePassword = exports.forgotPassword = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("../models/user"));
const address_1 = __importDefault(require("../models/address"));
const otp_1 = __importDefault(require("../models/otp"));
const otpStore = {};
// Transporter configuration for sending emails
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "devdoodleslearner@gmail.com",
        pass: "omosbcwpsmslqacn",
    },
});
// Register user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, shopName, addresses } = req.body;
    try {
        let user = yield user_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new user_1.default({
            name,
            email,
            password,
            role,
            shopName,
        });
        yield user.save();
        if (addresses && addresses.length > 0) {
            const addressPromises = addresses.map((address) => __awaiter(void 0, void 0, void 0, function* () {
                const newAddress = new address_1.default(Object.assign(Object.assign({}, address), { user: user._id }));
                const savedAddress = yield newAddress.save();
                return savedAddress._id;
            }));
            const addressIds = yield Promise.all(addressPromises);
            user.addresses = addressIds;
            yield user.save();
        }
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' }, (err, token) => {
            if (err)
                throw err;
            res.json({ user, token });
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        let user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        if (password !== user.password) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' }, (err, token) => {
            if (err)
                throw err;
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.login = login;
// Forgot Password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000;
        const otpInstance = new otp_1.default({
            email,
            otp,
            expiresAt,
        });
        yield otpInstance.save();
        yield transporter.sendMail({
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`,
        });
        res.json({ msg: 'OTP sent to your email' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.forgotPassword = forgotPassword;
// Verify OTP and Change Password
const verifyOtpAndChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword } = req.body;
    try {
        const otpRecord = yield otp_1.default.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }
        const currentDate = new Date();
        if (currentDate > otp.expiresAt) {
            return res.status(400).json({ msg: 'OTP has expired' });
        }
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.password = newPassword;
        yield user.save();
        yield otp_1.default.deleteOne({ email, otp });
        res.json({ msg: 'Password changed successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.verifyOtpAndChangePassword = verifyOtpAndChangePassword;
//# sourceMappingURL=authController.js.map