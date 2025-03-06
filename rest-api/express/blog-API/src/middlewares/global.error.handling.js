// 🔥 Global Error Handling Middleware
const globalErrorhandling = ((err, req, res, next) => {
    console.log(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors;

    res.status(statusCode).json({
        success: false,
        message: message,
        errors: errors,
    });
});

export default globalErrorhandling;