import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
    try {
        const token = req.cookies[process.env.JWT_ACCESS_TOKEN_NAME];
        if (!token) {
            return next(new ApiError(401, 'Access denied. No token provided.'));
        }

        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
        if (!decodedToken || !decodedToken._id) {
            return next(new ApiError(401, 'Invalid token.'));
        }

        req.userId = decodedToken._id;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(new ApiError(401, 'Token has expired.'));
        } else if (err.name === 'JsonWebTokenError') {
            return next(new ApiError(401, 'Invalid token.'));
        } else {
            return next(new ApiError(500, 'Internal server error.'));
        }
    }
}