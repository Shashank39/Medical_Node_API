"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenBlacklist_1 = require("../utils/tokenBlacklist");
function default_1(req, res, next) {
    const token = req.header('token');
    if (!token) {
        res.status(401).json({ msg: 'No token, authorization denied' });
        return;
    }
    if ((0, tokenBlacklist_1.isBlacklisted)(token)) {
        res.status(401).json({ msg: 'Token has been logged out' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}
//# sourceMappingURL=authMiddleware.js.map