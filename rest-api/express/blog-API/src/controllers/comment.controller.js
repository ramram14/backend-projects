import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import Comment from '../models/comment.model.js';
import CommentReply from '../models/comment.repyl.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

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