import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { uploadImageOnCloudinary, deleteImageOnCloudinary } from '../utils/cloudinary.js';

export const uploadImage = asyncHandler(async (req, res, next) => {
    const file = req.file;
    if (!file) {
        return next(new ApiError(400, 'No file uploaded'));
    }

    const responseUploadImage = await uploadImageOnCloudinary(file.path);

    return res.status(200).json(new ApiResponse(200, 'File uploaded successfully', { imageUrl: responseUploadImage }));
});

export const deleteImage = asyncHandler(async (req, res, next) => {
    const {imageUrl} = req.body;
    if (!imageUrl) {
        return next(new ApiError(400, 'No image url provided'));
    }

    const responseDeleteImage = await deleteImageOnCloudinary(imageUrl);
    if (!responseDeleteImage) {
        return next(new ApiError(400, 'Failed to delete image'));
    }

    return res.status(200).json(new ApiResponse(200, 'Image deleted successfully'));
});