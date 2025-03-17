import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../models/user.model.js';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../utils/cookies.options.js';
import jwt from 'jsonwebtoken';
import env from '../config/dotenv.js';

/**
 * Register a new user
 * 
 * This function handles the registration of a new user. It validates the incoming
 * request data (name, email, password, and password confirmation), checks for
 * existing users, and creates a new user if all conditions are met. Additionally,
 * it generates JWT access and refresh tokens, and responds with them in cookies.
 * 
 * @async
 * @function registerUser
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 400 - If any required fields are missing, passwords do not match, or the user already exists
 * @returns {void} Responds with a 201 status code, user data, success message, and cookies containing the JWT tokens
 */
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, password_confirmation } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password || !password_confirmation) {
    return next(new ApiError(400, 'All fields are required', 'Name, email, password, and password confirmation are required'));
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

  // Create user data without important fields
  const { password: _password, refreshToken: _refreshToken, ...userData } = user.toObject();

  res.status(201)
    .cookie(env.JWT_REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieOptions)
    .cookie(env.JWT_ACCESS_TOKEN_NAME, accessToken, accessTokenCookieOptions)
    .json(new ApiResponse(201, 'User registered successfully', userData));
});

/**
 * Log in an existing user
 * 
 * This function handles user login by validating the email and password provided
 * in the request. It checks if the user exists in the database, validates the 
 * password, and generates JWT access and refresh tokens if authentication is successful. 
 * The tokens are then sent back in cookies for further authentication.
 * 
 * @async
 * @function loginUser
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 400 - If any required fields are missing, user not found, or invalid credentials
 * @returns {void} Responds with a 200 status code, user data, success message, and cookies containing the JWT tokens
 */
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, 'All fields are required', 'Email and password are required'));
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

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();
  // Create user data without important fields
  const { password: _password, refreshToken: _refreshToken, ...userData } = user.toObject();
  res.status(200)
    .cookie(env.JWT_REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieOptions)
    .cookie(env.JWT_ACCESS_TOKEN_NAME, accessToken, accessTokenCookieOptions)
    .json(new ApiResponse(200, 'User logged in successfully', userData));
});

/**
 * Log out a user and clear authentication tokens
 * 
 * This function handles user logout by checking if the user exists, ensuring that the user has a 
 * valid refresh token, and then clearing the user's refresh token in the database. It also clears 
 * the JWT access and refresh tokens stored in cookies, effectively logging the user out.
 * 
 * @async
 * @function logoutUser
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 404 - If the user is not found
 * @throws {ApiError} 401 - If no refresh token is found for the user
 * @returns {void} Responds with a 200 status code, success message, and clears cookies
 */
export const logoutUser = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId)
  if (!user) {
    return next(new ApiError(404, "User not found"))
  }

  if (!user.refreshToken) {
    return next(new ApiError(401, "Unauthorized, no refresh token found"))
  }

  user.refreshToken = null

  await user.save()

  const incomingAccessToken = req.cookies[env.JWT_ACCESS_TOKEN_NAME];

  if (incomingAccessToken) {
    res.clearCookie(env.JWT_ACCESS_TOKEN_NAME)
  }

  res
    .clearCookie(env.JWT_REFRESH_TOKEN_NAME, { path: '/api/v1/auth/refresh-token' })
    .clearCookie(env.JWT_ACCESS_TOKEN_NAME)
    .status(200)
    .json(new ApiResponse(200, 'User logged out successfully'))
});

/**
 * Refresh the access token using a valid refresh token
 * 
 * This function handles the refresh of the access token by verifying the incoming refresh token from
 * the cookies. If the refresh token is valid and belongs to the user, a new access token is generated 
 * and sent back in a cookie. If any validation fails or errors occur during the process, an appropriate 
 * error is thrown.
 * 
 * @async
 * @function refreshAccessToken
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 401 - If the refresh token is missing, invalid, or does not match the user's refresh token
 * @throws {ApiError} 404 - If the user is not found
 * @throws {ApiError} 500 - If an internal server error occurs
 * @returns {void} Responds with a 200 status code, success message, and the new access token in a cookie
 */
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
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token has expired.'));
    } else if (err.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token.'));
    } else {
      return next(new ApiError(500, 'Internal server error.'));
    }
  }
});

/**
 * Retrieve the data of a user by their user ID
 * 
 * This function fetches the user data (excluding password and refresh token) by the user's ID 
 * from the request. If the user is not found, an error is thrown. Upon successful retrieval, 
 * the user data is returned in the response.
 * 
 * @async
 * @function getUserData
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @throws {ApiError} 404 - If the user is not found
 * @returns {void} Responds with a 200 status code and the user data in the response
 */
export const getUserData = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  res.status(200).json(new ApiResponse(200, 'User data retrieved successfully', user));
});