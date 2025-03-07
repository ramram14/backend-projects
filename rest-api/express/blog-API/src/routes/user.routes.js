import { Router } from "express";
import { getUserById, getUserPosts, updateUserName, updateUserEmail, updateUserPassword, updateUserProfilePicture, updateUserBio, deleteUser } from '../controllers/user.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route GET /api/v1/users/:id
 * @description Get a user by ID
 * @param {string} id - User ID
 * @access Public
 */
router.get('/:id', getUserById);

/**
 * @route GET /api/v1/users/:id/posts
 * @description Get a user's posts
 * @param {string} id - User ID
 * @access Public
 */
router.get('/:id/posts', getUserPosts);

// =============================================================
// Private routes
// =============================================================
router.use(verifyAccessToken);

/**
 * @route PATCH /api/v1/users/:id/update-name
 * @description Update the name of a user
 * @param {string} id - User ID
 * @access Private
 */
router.patch('/:id/update-name', updateUserName);

/**
 * @route PATCH /api/v1/users/:id/update-email
 * @description Update the email of a user
 * @param {string} id - User ID
 * @access Private
 */
router.patch('/:id/update-email', updateUserEmail);

/**
 * @route PATCH /api/v1/users/:id/update-password
 * @description Update the password of a user
 * @param {string} id - User ID
 * @access Private
 */
router.patch('/:id/update-password', updateUserPassword);

/**
 * @route PATCH /api/v1/users/:id/update-profile-picture
 * @description Update the profile picture of a user
 * @param {string} id - User ID
 * @access Private
 */
router.patch('/:id/update-profile-picture', updateUserProfilePicture);

/**
 * @route PATCH /api/v1/users/:id/update-bio
 * @description Update the bio of a user
 * @param {string} id - User ID
 * @access Private
 */
router.patch('/:id/update-bio', updateUserBio);

/**
 * @route DELETE /api/v1/users/:id
 * @description Delete a user
 * @param {string} id - User ID
 * @access Private
 */
router.delete('/:id', deleteUser);

export default router;
