import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import Comment from '../models/comment.model.js';
import CommentReply from '../models/comment.repyl.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

/**
 * Create a new comment for a post.
 * 
 * This function allows a user to create a comment on an existing post. It first checks if the user exists and if the required fields (text and postId) are provided. 
 * It also verifies that the post the comment is being added to exists. If all checks pass, a new comment is created and associated with the user and the post.
 * 
 * @async
 * @function createComment
 * @param {Object} req - The request object containing the text of the comment and the postId.
 * @param {Object} res - The response object used to send back the success message and the created comment.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or post is not found.
 * @throws {ApiError} 400 - If required fields (text and postId) are missing.
 * @returns {Object} Responds with a 201 status code, success message, and the created comment.
 */
export const createComment = asyncHandler(async (req, res, next) => {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { text, postId } = req.body;
    if (!text || !postId) {
        return next(new ApiError(400, 'All fields are required', 'Text and postId are required'));
    }

    const isPostExists = await Post.findById(postId);
    if (!isPostExists) {
        return next(new ApiError(404, 'Post not found'));
    }

    const comment = await Comment.create({
        text,
        user: user._id,
        post: postId
    });

    return res.status(201).json(new ApiResponse(201, 'Comment created successfully', comment));
});

/**
 * Create a new reply to a comment.
 * 
 * This function allows a user to reply to an existing comment. It first checks if the user exists and if the required fields (text and commentId) are provided. 
 * It also verifies that the comment the reply is being added to exists. If all checks pass, a new reply is created and added to the comment's replies array.
 * 
 * @async
 * @function createCommentReply
 * @param {Object} req - The request object containing the text of the reply and the commentId.
 * @param {Object} res - The response object used to send back the success message and the created comment reply.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or comment is not found.
 * @throws {ApiError} 400 - If required fields (text and commentId) are missing.
 * @returns {Object} Responds with a 201 status code, success message, and the created comment reply.
 */
export const createCommentReply = asyncHandler(async (req, res, next) => {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { text, commentId } = req.body;
    if (!text || !commentId) {
        return next(new ApiError(400, 'All fields are required', 'Text and commentId are required'));
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return next(new ApiError(404, 'Comment not found'));
    }

    const commentReply = await CommentReply.create({
        text,
        user: user._id,
    });

    comment.replies.push(commentReply._id);
    await comment.save();

    return res.status(201).json(new ApiResponse(201, 'Comment reply created successfully', commentReply));
});

/**
 * Update an existing comment.
 * 
 * This function allows a user to update their own comment. It checks if the user exists, if the comment exists, and if the user is the one who created the comment.
 * If all checks pass, it updates the comment's text and saves the changes.
 * 
 * @async
 * @function updateComment
 * @param {Object} req - The request object containing the new text and the comment's ID.
 * @param {Object} res - The response object used to send back the success message and the updated comment.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or comment is not found.
 * @throws {ApiError} 403 - If the user is not authorized to update this comment.
 * @throws {ApiError} 400 - If the required `text` field is missing.
 * @returns {Object} Responds with a 200 status code, success message, and the updated comment.
 */
export const updateComment = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
        return next(new ApiError(404, 'Comment not found'));
    }
    if (comment.user.toString() !== user._id.toString()) {
        return next(new ApiError(403, 'You are not authorized to update this comment'));
    }

    const { text } = req.body;
    if (!text) {
        return next(new ApiError(400, 'All fields are required', 'Text is required'));
    }

    comment.text = text;
    await comment.save();

    return res.status(200).json(new ApiResponse(200, 'Comment updated successfully', comment));
});

/**
 * Update an existing comment reply.
 * 
 * This function allows a user to update their own comment reply. It checks if the user exists, if the reply exists, and if the user is the one who created the reply.
 * If all checks pass, it updates the reply's text and saves the changes.
 * 
 * @async
 * @function updateCommentReply
 * @param {Object} req - The request object containing the new text and the reply's ID.
 * @param {Object} res - The response object used to send back the success message and the updated comment reply.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or comment reply is not found.
 * @throws {ApiError} 403 - If the user is not authorized to update this comment reply.
 * @throws {ApiError} 400 - If the required `text` field is missing.
 * @returns {Object} Responds with a 200 status code, success message, and the updated comment reply.
 */
export const updateCommentReply = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { replyId } = req.params;

    const commentReply = await CommentReply.findById(replyId);
    if (!commentReply) {
        return next(new ApiError(404, 'Comment reply not found'));
    }

    if (commentReply.user.toString() !== user._id.toString()) {
        return next(new ApiError(403, 'You are not authorized to update this comment reply'));
    }

    const { text } = req.body;

    if (!text) {
        return next(new ApiError(400, 'All fields are required', 'Text is required'));
    }

    commentReply.text = text;
    await commentReply.save();

    return res.status(200).json(new ApiResponse(200, 'Comment reply updated successfully', commentReply));
});

/**
 * Delete a comment by its ID.
 * 
 * This function allows a user to delete a comment they created. It verifies if the user exists, if the comment exists, and if the user is the one who created the comment.
 * If all checks pass, it deletes the comment.
 * 
 * @async
 * @function deleteComment
 * @param {Object} req - The request object containing the comment ID to be deleted.
 * @param {Object} res - The response object used to send back the success message.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or comment is not found.
 * @throws {ApiError} 403 - If the user is not authorized to delete the comment.
 * @returns {Object} Responds with a 200 status code and success message after the comment is deleted.
 */
export const deleteComment = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
        return next(new ApiError(404, 'Comment not found'));
    }

    if (comment.user.toString() !== user._id.toString()) {
        return next(new ApiError(403, 'You are not authorized to delete this comment'));
    }

    await Comment.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, 'Comment deleted successfully'));
});

/**
 * Delete a comment reply by its ID.
 * 
 * This function allows a user to delete a comment reply they created. It checks if the user exists, if the reply exists, and if the user is the one who created the reply.
 * If all checks pass, it deletes the reply.
 * 
 * @async
 * @function deleteCommentReply
 * @param {Object} req - The request object containing the reply ID to be deleted.
 * @param {Object} res - The response object used to send back the success message.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or comment reply is not found.
 * @throws {ApiError} 403 - If the user is not authorized to delete the comment reply.
 * @returns {Object} Responds with a 200 status code and success message after the comment reply is deleted.
 */
export const deleteCommentReply = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { replyId } = req.params;
    const commentReply = await CommentReply.findById(replyId);
    if (!commentReply) {
        return next(new ApiError(404, 'Comment reply not found'));
    }
    if (commentReply.user.toString() !== user._id.toString()) {
        return next(new ApiError(403, 'You are not authorized to delete this comment reply'));
    }

    await CommentReply.findByIdAndDelete(replyId);

    return res.status(200).json(new ApiResponse(200, 'Comment reply deleted successfully'));
});