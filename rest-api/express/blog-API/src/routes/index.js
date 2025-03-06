import { Router } from "express";
import ApiError from '../utils/ApiError.js';

const router = Router();

// Auth Routes
import authRoutes from './auth.routes.js';
router.use('/auth', authRoutes);

// User Routes
import userRoutes from './user.routes.js';
router.use('/users', userRoutes);

// Not found handler
router.all('*', (req, res, next) => {
    next(new ApiError(404, 'Not Found', [`${req.url} method ${req.method} is wrong url`]));
});

export default router;