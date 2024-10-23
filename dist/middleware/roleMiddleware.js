"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ msg: 'Access denied' });
            return;
        }
        next();
    };
};
exports.default = roleMiddleware;
//# sourceMappingURL=roleMiddleware.js.map