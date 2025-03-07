import { Router } from "express";
import { uploadImage, deleteImage } from "../controllers/image.controller.js";
import { verifyAccessToken } from '../middlewares/auth.middleware.js';
import { uploadFileMulter } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyAccessToken);
router.post('/', uploadFileMulter.single('image'), uploadImage);
router.delete('/', deleteImage);

export default router;