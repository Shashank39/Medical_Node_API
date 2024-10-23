"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlacklisted = exports.addToBlacklist = void 0;
const blacklist = new Set();
const addToBlacklist = (token) => {
    blacklist.add(token);
};
exports.addToBlacklist = addToBlacklist;
const isBlacklisted = (token) => {
    return blacklist.has(token);
};
exports.isBlacklisted = isBlacklisted;
//# sourceMappingURL=tokenBlacklist.js.map