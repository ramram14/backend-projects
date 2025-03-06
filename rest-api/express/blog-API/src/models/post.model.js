import { Schema, models, model } from "mongoose";

const postSchema = new Schema(
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
            type: Schema.Types.Mixed,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
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
        categories: {
            type: Schema.Types.ObjectId,
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
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    },
    {
        timestamps: true
    }
)

const Post = models.Post || model("Post", postSchema);
export default Post;