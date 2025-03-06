import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import env from '../config/dotenv.js';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
});

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

export const deleteImageOnCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return null

        const parts = imageUrl.split('/');
        const publicId = `${parts[parts.length - 2]}/${parts[parts.length - 1].split('.')[0]}`;
        await cloudinary.api.delete_resources([publicId], {
            type: 'upload',
            resource_type: 'image'
        });
        return true;
    } catch (error) {
        console.log('Error while deleting image', error);
        // if cant delete the image on cloudinary we just return null because we don't want to block the process, console the error is enough for now
        return null
    }
};