import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUserData, refreshAccessToken } from "../controllers/auth.controller.js";

const router = Router();

router.get('/me', getUserData);
router.get('/refresh-token', refreshAccessToken);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/logout', logoutUser);

export default router;