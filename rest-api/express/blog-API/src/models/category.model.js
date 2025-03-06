import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;