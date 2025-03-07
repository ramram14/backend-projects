import mongoose from "mongoose";
// 🔥 Global Error Handling Middleware
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


    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors || null;


    res.status(statusCode).json({
        success: false,
        message,
        errors
    });
});

export default globalErrorhandling;