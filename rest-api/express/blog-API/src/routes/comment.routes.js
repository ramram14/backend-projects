import { Router } from "express";
import { createComment, createCommentReply, updateComment, updateCommentReply, deleteComment, deleteCommentReply } from "../controllers/comment.controller.js";
import { verifyAccessToken } from '../middlewares/auth.middleware.js';


const router = Router();


router.use(verifyAccessToken);

router.post('/', createComment);
router.post('/reply', createCommentReply);
router.put('/:id', updateComment);
router.put('/reply/:replyId', updateCommentReply);
router.delete('/:id', deleteComment);
router.delete('/reply/:replyId', deleteCommentReply);

export default router;