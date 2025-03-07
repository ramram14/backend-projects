import slugify from "slugify";
import Post from "../models/post.model.js";

export const generateSlugByTitle = async (title) => {
    const slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true
    });
    let uniqueSlug = slug;
    let counter = 2;
    while (await Post.exists({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    };

    return uniqueSlug;
}