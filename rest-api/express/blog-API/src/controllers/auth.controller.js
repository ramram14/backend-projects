import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../models/user.model.js';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../utils/cookies.options.js';
import jwt from 'jsonwebtoken';
import env from '../config/dotenv.js';

export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, password_confirmation } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password || !password_confirmation) {
        return next(new ApiError(400, 'All fields are required'));
    }

    // Check if password is at least 6 characters
    if (password.length < 6) {
        return next(new ApiError(400, 'Password must be at least 6 characters'));
    }

    // Check if password same as password_confirmation
    if (password !== password_confirmation) {
        return next(new ApiError(400, 'Passwords do not match'));
    }

    // Check if user email or name already exists
    const userExists = await User.findOne({ email, name });
    if (userExists) {
        return next(new ApiError(400, 'User already exists'));
    }

    const user = new User({ name, email, password });

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken

    await user.save()

    res.status(201)
        .cookie(env.JWT_REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieOptions)
        .cookie(env.JWT_ACCESS_TOKEN_NAME, accessToken, accessTokenCookieOptions)
        .json(new ApiResponse(201, 'User registered successfully',))
});

export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ApiError(400, 'All fields are required'));
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError(400, 'Invalid email or password'));
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return next(new ApiError(400, 'Invalid email or password'));
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save();

    res.status(200)
        .cookie(env.JWT_REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieOptions)
        .cookie(env.JWT_ACCESS_TOKEN_NAME, accessToken, accessTokenCookieOptions)
        .json(new ApiResponse(200, 'User logged in successfully'))
});

export const logoutUser = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.cookies[env.JWT_REFRESH_TOKEN_NAME];
    if (!incomingRefreshToken) {
        return next(new ApiError(401, "Unauthorized"))
    }
    const userId = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_TOKEN_SECRET_KEY)?._id;
    if (!userId) {
        return next(new ApiError(401, "Unauthorized"))
    }

    const user = await User.findById(userId)
    if (!user) {
        return next(new ApiError(404, "User not found"))
    }

    if (user.refreshToken !== incomingRefreshToken) {
        return next(new ApiError(401, "Unauthorized"))
    }

    user.refreshToken = null

    await user.save()


    res.clearCookie(env.JWT_REFRESH_TOKEN_NAME)
        .status(200)
        .json(new ApiResponse(200, 'User logged out successfully'))
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
    try {
        const incomingRefreshToken = req.cookies[env.JWT_REFRESH_TOKEN_NAME];
        if (!incomingRefreshToken) {
            return next(new ApiError(401, "Unauthorized"))
        }
        const userId = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_TOKEN_SECRET_KEY)?._id;
        if (!userId) {
            return next(new ApiError(401, "Unauthorized"))
        }

        const user = await User.findById(userId)
        if (!user) {
            return next(new ApiError(404, "User not found"))
        }
        if (user.refreshToken !== incomingRefreshToken) {
            return next(new ApiError(401, "Unauthorized"))
        }

        // Generate new access token
        const newAccessToken = user.generateAccessToken()

        res
            .clearCookie(env.JWT_ACCESS_TOKEN_NAME)
            .status(200)
            .cookie(env.JWT_ACCESS_TOKEN_NAME, newAccessToken, accessTokenCookieOptions)
            .json(new ApiResponse(200, 'Success',));
    } catch (error) {
        return next(new ApiError(500, "Something went wrong while generating refresh and access token"))
    }
});

export const getUserData = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) {
        return next(new ApiError(404, "User not found"));
    }
    res.status(200).json(new ApiResponse(200, 'User data retrieved successfully', user));
});