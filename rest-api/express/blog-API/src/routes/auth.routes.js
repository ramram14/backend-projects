import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUserData, refreshAccessToken } from "../controllers/auth.controller.js";
import { verifyAccessToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/me', verifyAccessToken, getUserData);
router.get('/refresh-token', refreshAccessToken);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/logout', verifyAccessToken, logoutUser);

export default router;