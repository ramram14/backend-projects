import mongoose from 'mongoose';

const commentReplySchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true
    }
)

const CommentReply = mongoose.models.CommentReply || mongoose.model("CommentReply", commentReplySchema);
export default CommentReply;