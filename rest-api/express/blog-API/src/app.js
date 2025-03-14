import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import compression from 'compression';
import ApiError from './utils/ApiError.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        credentials: true,
    })
);
app.use(helmet());  // 🔒 Protection HTTP request
app.use(morgan('dev')); // 📜 Logging request to console
app.use(hpp()); // 🛡️ Protection from HTTP Parameter Pollution
app.use(compression()); // 🚀 Faster request with compression

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Maks 100 request from the same IP
    message: 'Too many requests from this IP, please try again later'
});

// All Routes
import apiRoutes from './routes/index.js';
app.use('/api/v1', limiter, apiRoutes);

// Not found handler
app.all('*', (req, res, next) => {
    next(new ApiError(404, 'Not Found', [`${req.url} method ${req.method} is wrong url`]));
});

// Global Error Handling Middleware
import globalErrorhandling from './middlewares/global.error.handling.js';
app.use(globalErrorhandling);

export default app;