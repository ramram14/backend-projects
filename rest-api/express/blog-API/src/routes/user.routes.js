import { Router } from "express";
import { getUserById, getUserPosts, updateUserName, updateUserEmail, updateUserPassword, updateUserProfilePicture, updateUserBio, deleteUser } from '../controllers/user.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:id', getUserById);
router.get('/:id/posts', getUserPosts);

router.use(verifyAccessToken);
router.patch('/:id/update-name', updateUserName);
router.patch('/:id/update-email', updateUserEmail);
router.patch('/:id/update-password', updateUserPassword);
router.patch('/:id/update-profile-picture', updateUserProfilePicture);
router.patch('/:id/update-bio', updateUserBio);
router.delete('/:id', deleteUser);

export default router;
