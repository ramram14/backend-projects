import { Router } from "express";
import { createComment, createCommentReply, updateComment, updateCommentReply, deleteComment, deleteCommentReply } from "../controllers/comment.controller.js";
import { verifyAccessToken } from '../middlewares/auth.middleware.js';


const router = Router();


router.use(verifyAccessToken);

/**
 * @route POST /api/v1/comments
 * @description Create a new comment
 * @access Private
 */
router.post('/', createComment);

/**
 * @route POST /api/v1/comments/reply
 * @description Create a new comment reply
 * @access Private
 */
router.post('/reply', createCommentReply);

/**
 * @route PUT /api/v1/comments/:id
 * @description Update a comment
 * @param {string} id - Comment ID
 * @access Private
 */
router.put('/:id', updateComment);

/**
 * @route PUT /api/v1/comments/reply/:replyId
 * @description Update a comment reply
 * @param {string} replyId - Comment reply ID
 * @access Private
 */
router.put('/reply/:replyId', updateCommentReply);

/**
 * @route DELETE /api/v1/comments/:id
 * @description Delete a comment
 * @param {string} id - Comment ID
 * @access Private
 */
router.delete('/:id', deleteComment);

/**
 * @route DELETE /api/v1/comments/reply/:replyId
 * @description Delete a
 * @param {string} replyId - Comment reply ID
 * @access Private
 */
router.delete('/reply/:replyId', deleteCommentReply);

export default router;