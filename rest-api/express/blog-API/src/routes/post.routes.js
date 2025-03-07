import { Router } from "express";
import { getAllPosts, getPostbySlug, getPostCommentsBySlug, createPost, updatePostTitle, updatePostContentAndSubtitle, updatePostImage, updatePostCategory, deletePost } from '../controllers/post.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/:slug', getPostbySlug);
router.get('/:slug/comments', getPostCommentsBySlug);

router.use(verifyAccessToken);
router.post('/', createPost);
router.patch('/:id/update-title', updatePostTitle);
router.patch('/:id/update-content-and-subtitle', updatePostContentAndSubtitle);
router.patch('/:id/update-image', updatePostImage);
router.patch('/:id/update-category', updatePostCategory);
router.delete('/:id', deletePost);

export default router;