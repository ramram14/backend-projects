import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUserData, refreshAccessToken } from "../controllers/auth.controller.js";
import { verifyAccessToken } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route GET /api/v1/auth/me
 * @description Get the user's data
 * @access Private
 */
router.get('/me', verifyAccessToken, getUserData);

/**
 * @route POST /api/v1/auth/refresh-token
 * @description Refresh access token
 * @access Public
 */
router.get('/refresh-token', refreshAccessToken);

/**
 * @route POST /api/v1/auth/register
 * @description Register a new user and get access and refresh tokens
 * @access Public
 */
router.post('/register', registerUser);

/**
 * @route POST /api/v1/auth/login
 * @description Login a user and get access and refresh tokens
 * @access Public
 */
router.post('/login', loginUser);

/**
 * @route DELETE /api/v1/auth/logout
 * @description Logout a user and clear the access and refresh token
 * @access Private
 */
router.delete('/logout', verifyAccessToken, logoutUser);

export default router;