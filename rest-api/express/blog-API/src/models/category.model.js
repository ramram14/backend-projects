import { Schema, model, models } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            enum: ['Lifestyle', 'Hoby', 'Technology', 'Fashion', 'Gaming', 'Health', 'Business', 'Education', 'philosophy', 'Other'],
            required: true,
            unique: true,
            trim: true,
        },
    }
)

const Category = models.Category || model("Category", categorySchema);
export default Category;