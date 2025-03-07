import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import env from '../config/dotenv.js';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
});


/**
 * Uploads an image to Cloudinary.
 * This function uploads an image from a local file path to the Cloudinary server, 
 * applies a transformation (resize and crop), and deletes the local file after a successful upload.
 *
 * @function uploadImageOnCloudinary
 * @param {string} localFilePath - The local path of the image file to upload.
 * @returns {string|null} The secure URL of the uploaded image on Cloudinary, or `null` if the upload fails.
 * 
 * @throws {Error} If the upload fails, the local file will be deleted and `null` will be returned.
 */
export const uploadImageOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: 'blog-api',
            resource_type: "image",
            transformation: [
                { width: 800, height: 1000, crop: "fill", gravity: "auto" },
            ],
            format: 'jpg'
        })

        // file has been uploaded successfull
        fs.unlinkSync(localFilePath)
        return response.secure_url;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
};

/**
 * Deletes an image from Cloudinary by its URL.
 * This function extracts the public ID from the image URL and deletes the corresponding image from Cloudinary.
 *
 * @function deleteImageOnCloudinary
 * @param {string} imageUrl - The URL of the image to delete from Cloudinary.
 * @returns {boolean|null} `true` if the image was deleted successfully, or `null` if an error occurred.
 * 
 * @throws {Error} If the image cannot be deleted, an error message is logged, and `null` is returned.
 */
export const deleteImageOnCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return null
        
        // Extract the public ID from the image URL
        const parts = imageUrl.split('/');
        const publicId = `${parts[parts.length - 2]}/${parts[parts.length - 1].split('.')[0]}`;

        // Delete the image from Cloudinary
        await cloudinary.api.delete_resources([publicId], {
            type: 'upload',
            resource_type: 'image'
        });
        return true;
    } catch (error) {
        console.log('Error while deleting image', error);
        // If the deletion fails, log the error and return null
        return null
    }
};