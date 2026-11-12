import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'stayfinder_dev_jwt_secret_key_2026_super_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
};

export default config;
