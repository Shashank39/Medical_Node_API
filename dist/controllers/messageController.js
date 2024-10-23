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
exports.getInTouch = void 0;
const message_1 = __importDefault(require("../models/message"));
const nodemailer_1 = __importDefault(require("nodemailer"));
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
const getInTouch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message, phone } = req.body;
    try {
        const newMessage = new message_1.default({ name, email, message, phone });
        yield transporter.sendMail({
            to: 'devdoodleslearner@gmail.com',
            subject: 'Hi, I need to connect',
            text: `User Details are Name: ${name}, Email: ${email}, Message: ${message}, Phone: ${phone}.`,
        });
        yield newMessage.save();
        return res.status(201).json({ msg: 'Message sent successfully!' });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
});
exports.getInTouch = getInTouch;
//# sourceMappingURL=messageController.js.map