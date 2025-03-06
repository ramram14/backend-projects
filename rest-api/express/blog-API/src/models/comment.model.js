import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
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
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CommentReply'
            }
        ]
    },
    {
        timestamps: true
    }
)

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;