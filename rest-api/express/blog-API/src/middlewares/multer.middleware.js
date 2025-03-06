import multer from 'multer';

// Multer config
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
export const uploadFileMulter = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})

