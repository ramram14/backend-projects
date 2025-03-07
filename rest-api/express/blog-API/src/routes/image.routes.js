import { Router } from "express";
import { uploadImage, deleteImage } from "../controllers/image.controller.js";
import { verifyAccessToken } from '../middlewares/auth.middleware.js';
import { uploadFileMulter } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyAccessToken);

/**
 * @route POST /api/v1/images
 * @description Upload an image
 * @access Private
 */
router.post('/', uploadFileMulter.single('image'), uploadImage);

/**
 * @route DELETE /api/v1/images
 * @description Delete an image
 * @access Private
 */
router.delete('/', deleteImage);

export default router;