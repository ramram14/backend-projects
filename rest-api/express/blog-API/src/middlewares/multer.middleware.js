import multer from 'multer';

/**
 * Configuration for Multer file upload middleware.
 * This configuration sets up disk storage and defines the file size limit.
 * The uploaded file will be stored with its original name in the server.
 *
 * @function uploadFileMulter
 * @returns {Object} - The Multer middleware that handles file uploads.
 * @example
 * Example of how to use this middleware in a route
 * app.post('/upload', uploadFileMulter.single('file'), (req, res) => {
 *    res.send('File uploaded successfully');
 * });
 */

// Multer config
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Multer middleware with storage and file size limit of 2MB
export const uploadFileMulter = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // 2MB file size limit
    }
})

