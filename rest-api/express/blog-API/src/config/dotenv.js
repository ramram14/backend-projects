import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'DB_URI',
    'JWT_REFRESH_TOKEN_SECRET_KEY',
    'JWT_REFRESH_TOKEN_EXPIRY',
    'JWT_REFRESH_TOKEN_NAME',
    'JWT_ACCESS_TOKEN_SECRET_KEY',
    'JWT_ACCESS_TOKEN_EXPIRY',
    'JWT_ACCESS_TOKEN_NAME',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`${envVar} is not defined in the environment variables`);
        process.exit(1);
    }
});

export default {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    JWT_REFRESH_TOKEN_SECRET_KEY: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY,
    JWT_REFRESH_TOKEN_NAME: process.env.JWT_REFRESH_TOKEN_NAME,
    JWT_ACCESS_TOKEN_SECRET_KEY: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    JWT_ACCESS_TOKEN_NAME: process.env.JWT_ACCESS_TOKEN_NAME,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};