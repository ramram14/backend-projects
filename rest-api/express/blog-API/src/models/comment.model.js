import {Schema, model, models} from "mongoose";

const commentSchema = new Schema(
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
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true
    }
)

const Comment = models.Comment || model("Comment", commentSchema);
export default Comment;