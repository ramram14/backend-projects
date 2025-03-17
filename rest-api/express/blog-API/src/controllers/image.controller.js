import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { uploadImageOnCloudinary, deleteImageOnCloudinary } from '../utils/cloudinary.js';

/**
 * Upload an image to Cloudinary.
 * 
 * This function handles the uploading of an image file sent through a multipart/form-data request. It validates the presence of a file and uploads it to Cloudinary. 
 * If successful, the image URL is returned in the response.
 * 
 * @async
 * @function uploadImage
 * @param {Object} req - The request object containing the file to be uploaded.
 * @param {Object} res - The response object used to send back the success message and image URL after upload.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 400 - If no file is uploaded.
 * @returns {Object} Responds with a 200 status code, success message, and the uploaded image URL.
 */
export const uploadImage = asyncHandler(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new ApiError(400, 'No file uploaded'));
  }

  const responseUploadImage = await uploadImageOnCloudinary(file.path);

  return res.status(200).json(new ApiResponse(200, 'File uploaded successfully', { imageUrl: responseUploadImage }));
});

/**
 * Delete an image from Cloudinary.
 * 
 * This function handles the deletion of an image from Cloudinary. It accepts an image URL in the request body and attempts to delete the corresponding image from Cloudinary.
 * If the deletion is successful, a confirmation message is returned.
 * 
 * @async
 * @function deleteImage
 * @param {Object} req - The request object containing the image URL to be deleted.
 * @param {Object} res - The response object used to send back the success message after deletion.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 400 - If no image URL is provided or if the deletion fails.
 * @returns {Object} Responds with a 200 status code and a success message after image deletion.
 */
export const deleteImage = asyncHandler(async (req, res, next) => {
  const { imageUrl } = req.body;
  console.log(imageUrl);
  if (!imageUrl) {
    return next(new ApiError(400, 'No image url provided'));
  }

  const responseDeleteImage = await deleteImageOnCloudinary(imageUrl);
  if (!responseDeleteImage) {
    return next(new ApiError(400, 'Failed to delete image'));
  }

  return res.status(200).json(new ApiResponse(200, 'Image deleted successfully'));
});