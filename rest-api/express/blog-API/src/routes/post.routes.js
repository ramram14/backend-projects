import { Router } from "express";
import { getAllPosts, getPostbySlug, getPostCommentsBySlug, createPost, updatePostTitle, updatePostContentAndSubtitle, updatePostImage, updatePostCategory, deletePost } from '../controllers/post.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';

const router = Router();


/**
 * @route GET /api/v1/posts
 * @description Get all posts
 * @access Public
 */
router.get('/', getAllPosts);

/**
 * @route GET /api/v1/posts/:slug
 * @description Get a post by slug
 * @param {string} slug - Post slug
 * @access Public
 */
router.get('/:slug', getPostbySlug);

/**
 * @route GET /api/v1/posts/:slug/comments
 * @description Get post comments by slug
 * @param {string} slug - Post slug
 * @access Public
 */
router.get('/:slug/comments', getPostCommentsBySlug);

// =============================================================
// Private routes
// =============================================================
router.use(verifyAccessToken);

/**
 * @route POST /api/v1/posts
 * @description Create a new post
 * @access Private
 */
router.post('/', createPost);

/**
 * @route PATCH /api/v1/posts/:id/update-title
 * @description Update the title of a post
 * @param {string} id - Post ID
 * @access Private
 */
router.patch('/:id/update-title', updatePostTitle);

/**
 * @route PATCH /api/v1/posts/:id/update-content-and-subtitle
 * @description Update the content and subtitle of a post
 * @param {string} id - Post ID
 * @access Private
 */
router.patch('/:id/update-content-and-subtitle', updatePostContentAndSubtitle);

/**
 * @route PATCH /api/v1/posts/:id/update-image
 * @description Update the image of a post
 * @param {string} id - Post ID
 * @access Private
 */
router.patch('/:id/update-image', updatePostImage);

/**
 * @route PATCH /api/v1/posts/:id/update-category
 * @description Update the category of a post
 * @param {string} id - Post ID
 * @access Private
 */
router.patch('/:id/update-category', updatePostCategory);

/**
 * @route DELETE /api/v1/posts/:id
 * @description Delete a post
 * @param {string} id - Post ID
 * @access Private
 */
router.delete('/:id', deletePost);

export default router;