import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';

/**
 * Retrieve a user by their ID
 * 
 * This function fetches a user's data by their ID from the request parameters 
 * and returns it in the response, excluding the password and refresh token.
 * 
 * @async
 * @function getUserById
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 404 - If the user is not found
 * @returns {void} Responds with a 200 status code and the user data
 */
export const getUserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password -refreshToken');
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }
    res.status(200).json(new ApiResponse(200, 'User retrieved successfully', user));
});

/**
 * Retrieve posts of a user by their ID
 * 
 * This function fetches all posts by a specific user based on the user ID 
 * from the request parameters and returns them in the response.
 * 
 * @async
 * @function getUserPosts
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void} Responds with a 200 status code and the posts
 */
export const getUserPosts = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const posts = await Post.find({ author: id })
        .populate('author');

    res.status(200).json(new ApiResponse(200, 'User posts retrieved successfully', posts));
});

/**
 * Update a user's name
 * 
 * This function updates the user's name by verifying the provided password 
 * and ensuring that the request is authorized before making changes.
 * 
 * @async
 * @function updateUserName
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 400 - If the required fields are missing or password is incorrect
 * @throws {ApiError} 403 - If the user is not authorized to update this account
 * @returns {void} Responds with a 200 status code and a success message
 */
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

/**
 * Update a user's email
 * 
 * This function updates the user's email by verifying the provided password 
 * and ensuring that the request is authorized before making changes.
 * 
 * @async
 * @function updateUserEmail
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 400 - If the required fields are missing or password is incorrect
 * @throws {ApiError} 403 - If the user is not authorized to update this account
 * @returns {void} Responds with a 200 status code and a success message
 */
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

/**
 * Update a user's password
 * 
 * This function updates the user's password by verifying the provided current password 
 * and ensuring the request is authorized before making changes.
 * 
 * @async
 * @function updateUserPassword
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 400 - If the required fields are missing or password is incorrect
 * @throws {ApiError} 403 - If the user is not authorized to update this account
 * @returns {void} Responds with a 200 status code and a success message
 */
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

/**
 * Update a user's profile picture
 * 
 * This function updates the user's profile picture after verifying the request 
 * is authorized, and the image data is provided.
 * 
 * @async
 * @function updateUserProfilePicture
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 400 - If the required field 'image' is missing
 * @throws {ApiError} 403 - If the user is not authorized to update this account
 * @returns {void} Responds with a 200 status code and a success message
 */
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

/**
 * Update a user's bio
 * 
 * This function updates the user's bio after verifying the request 
 * is authorized, and the bio data is provided.
 * 
 * @async
 * @function updateUserBio
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 400 - If the required field 'bio' is missing
 * @throws {ApiError} 403 - If the user is not authorized to update this account
 * @returns {void} Responds with a 200 status code and a success message
 */
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

/**
 * Delete a user account
 * 
 * This function deletes a user account after verifying the provided password 
 * and ensuring that the request is authorized.
 * 
 * @async
 * @function deleteUser
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 400 - If the required password is missing or incorrect
 * @throws {ApiError} 403 - If the user is not authorized to delete this account
 * @returns {void} Responds with a 200 status code and a success message
 */
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