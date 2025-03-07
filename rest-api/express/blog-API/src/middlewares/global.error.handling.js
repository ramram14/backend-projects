import mongoose from "mongoose";


// 🔥 Global Error Handling Middleware

/**
 * Global error handling middleware for Express.
 * This middleware handles different types of errors including CastError (invalid ObjectId or type errors) 
 * and ValidationError (Mongoose schema validation errors).
 * It formats the error response before sending it to the client.
 *
 * @function globalErrorhandling
 * @param {Object} err - The error object thrown by the route handler or other middleware.
 * @param {Object} req - The request object, used to get the incoming request data.
 * @param {Object} res - The response object, used to send the error response back to the client.
 * @param {Function} next - The next middleware function in the chain. 
 * @returns {void} - This function does not return anything. It sends an error response to the client.
 */
const globalErrorhandling = ((err, req, res, next) => {
    console.log(err.message);

    // Handle CastError (Invalid ObjectId or Type Errors)
    if (err instanceof mongoose.Error.CastError) {
        const message = `Invalid ${err.path}: ${err.value}`;
        err.message = message;
        err.statusCode = 400;
    }

    // Handle ValidationError (Schema validation errors)
    if (err instanceof mongoose.Error.ValidationError) {
        err.statusCode = 400;
        err.message = "Validation Error";
        const errors = Object.values(err.errors).map(el => el.message); // Mengambil semua pesan error dari Mongoose
        err.errors = errors;
    }

    // Default error handling
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors || null;

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        errors
    });
});

export default globalErrorhandling;