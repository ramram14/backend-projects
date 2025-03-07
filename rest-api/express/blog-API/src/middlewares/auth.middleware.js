import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import env from '../config/dotenv.js'

/**
 * Middleware to verify the JWT access token.
 * This middleware checks for the presence of a JWT token in the cookies
 * and verifies its validity. If valid, it adds the user's ID to the request.
 * If the token is invalid or missing, it sends an error response.
 *
 * @function verifyAccessToken
 * @param {Object} req - The request object, which holds the token in cookies and will store the userId.
 * @param {Object} res - The response object, used to send an error response if the token is invalid or missing.
 * @param {Function} next - The next middleware or route handler to call if the token is valid.
 * @returns {void} It either forwards the request to the next handler or sends an error response.
 * @throws {ApiError} If the token is missing, expired, invalid, or another server error occurs.
 */
export const verifyAccessToken = (req, res, next) => {
    try {
        // Retrieve the token from the cookies
        const token = req.cookies[env.JWT_ACCESS_TOKEN_NAME];
        if (!token) {
            return next(new ApiError(401, 'Access denied. No token provided.'));
        }

        // Verify the token
        const decodedToken = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET_KEY);
        if (!decodedToken || !decodedToken._id) {
            return next(new ApiError(401, 'Invalid token.'));
        }

        // Attach the user's ID to the request object
        req.userId = decodedToken._id;
        next();
    } catch (err) {
        // Handle different token errors
        if (err.name === 'TokenExpiredError') {
            return next(new ApiError(401, 'Token has expired.'));
        } else if (err.name === 'JsonWebTokenError') {
            return next(new ApiError(401, 'Invalid token.'));
        } else {
            return next(new ApiError(500, 'Internal server error.'));
        }
    }
}