import { Router } from "express";

const router = Router();

// Auth Routes
import authRoutes from './auth.routes.js';
router.use('/auth', authRoutes);

// User Routes
import userRoutes from './user.routes.js';
router.use('/users', userRoutes);

// Post Routes
import postRoutes from './post.routes.js';
router.use('/posts', postRoutes);

// Comment Routes
import commentRoutes from './comment.routes.js';
router.use('/comments', commentRoutes);

// Image Routes
import imageRoutes from './image.routes.js';
router.use('/images', imageRoutes);



export default router;