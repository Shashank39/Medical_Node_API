"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// env.ts
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Function to get the environment variables with type checking
const getEnv = () => {
    return {
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        PORT: process.env.PORT || '3000', // Default to '3000' if PORT is not set
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
    };
};
// Export the environment variables
const env = getEnv();
exports.default = env;
//# sourceMappingURL=env.js.map