import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ApiError from './utils/ApiError.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Not found handler
app.all('*', (req, res, next) => {
    next(new ApiError(404, 'Not Found', [`${req.url} method ${req.method} is wrong url`]));
});

// Global Error Handling Middleware
import globalErrorhandling from './middlewares/global.error.handling.js';
app.use(globalErrorhandling);

export default app;