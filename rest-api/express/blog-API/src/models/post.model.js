import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, 'Title must be at least 3 characters'],
            maxLength: [100, 'Title cannot exceed 100 characters']
        },
        subtitle: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, 'Subtitle must be at least 3 characters'],
            maxLength: [100, 'Subtitle cannot exceed 100 characters']
        },
        content: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        image: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
        ,
        views: {
            type: Number,
            default: 0
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
    },
    {
        timestamps: true
    }
)

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;