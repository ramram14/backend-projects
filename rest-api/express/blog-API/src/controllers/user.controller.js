import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';

export const getUserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password -refreshToken');
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }
    res.status(200).json(new ApiResponse(200, 'User retrieved successfully', user));
});

export const getUserPosts = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const posts = await Post.find({ author: id })
        .populate('author');

    res.status(200).json(new ApiResponse(200, 'User posts retrieved successfully', posts));
});

export const updateUserName = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, password } = req.body;
    if (!name || !password) {
        return next(new ApiError(400, 'All fields are required', 'Name and password are required'));
    }

    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    };

    const userIdFromToken = req.userId;
    if (user._id.toString() !== userIdFromToken) {
        return next(new ApiError(403, 'You are not authorized to update this user'));
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return next(new ApiError(400, 'Invalid password'));
    }

    user.name = name;
    await user.save();

    res.status(200).json(new ApiResponse(200, 'User name updated successfully'));
});

export const updateUserEmail = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ApiError(400, 'All fields are required', 'Email and password are required'));
    }

    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    };

    const userIdFromToken = req.userId;
    if (user._id.toString() !== userIdFromToken) {
        return next(new ApiError(403, 'You are not authorized to update this user'));
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return next(new ApiError(400, 'Invalid password'));
    }

    user.email = email;
    await user.save();
    res.status(200).json(new ApiResponse(200, 'User email updated successfully'));
});

export const updateUserPassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
        return next(new ApiError(400, 'All fields are required', 'Password and new password are required'));
    }

    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    };

    const userIdFromToken = req.userId;
    if (user._id.toString() !== userIdFromToken) {
        return next(new ApiError(403, 'You are not authorized to update this user'));
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return next(new ApiError(400, 'Invalid password'));
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json(new ApiResponse(200, 'User password updated successfully'));
});

export const updateUserProfilePicture = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { image } = req.body;
    if (!image) {
        return next(new ApiError(400, 'All fields are required', 'Profile picture is required'));
    }

    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    };

    const userIdFromToken = req.userId;
    if (user._id.toString() !== userIdFromToken) {
        return next(new ApiError(403, 'You are not authorized to update this user'));
    }

    user.image = image;
    await user.save();

    res.status(200).json(new ApiResponse(200, 'User profile picture updated successfully'));
});

export const updateUserBio = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { bio } = req.body;
    if (!bio) {
        return next(new ApiError(400, 'All fields are required', 'Bio is required'));
    }

    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    };

    const userIdFromToken = req.userId;
    if (user._id.toString() !== userIdFromToken) {
        return next(new ApiError(403, 'You are not authorized to update this user'));
    }

    user.bio = bio;
    await user.save();
    res.status(200).json(new ApiResponse(200, 'User bio updated successfully'));
});

export const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const { password } = req.body;
    if (!password) {
        return next(new ApiError(400, 'All fields are required', 'Password is required'));
    }

    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const userIdFromToken = req.userId;
    if (user._id.toString() !== userIdFromToken) {
        return next(new ApiError(403, 'You are not authorized to update this user'));
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return next(new ApiError(400, 'Invalid password'));
    }

    await user.deleteOne();
    res.status(200).json(new ApiResponse(200, 'User deleted successfully'));
});