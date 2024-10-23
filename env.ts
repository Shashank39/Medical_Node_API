// env.ts
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define the expected types for the environment variables
interface Env {
  MONGO_URI: string;
  JWT_SECRET: string;
  PORT: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
}

// Function to get the environment variables with type checking
const getEnv = (): Env => {
  return {
    MONGO_URI: process.env.MONGO_URI as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    PORT: process.env.PORT || '3000', // Default to '3000' if PORT is not set
    EMAIL_USER: process.env.EMAIL_USER as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
  };
};

// Export the environment variables
const env = getEnv();
export default env;
