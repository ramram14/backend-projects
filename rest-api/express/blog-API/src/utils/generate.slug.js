import slugify from "slugify";
import Post from "../models/post.model.js";


/**
 * Generate a unique slug based on a title.
 * This function takes a title, converts it into a slug, and ensures that the slug is unique 
 * by appending a counter to it if it already exists in the database.
 *
 * @function generateSlugByTitle
 * @param {string} title - The title to generate the slug from.
 * @returns {Promise<string>} - A promise that resolves to a unique slug.
 * @throws {Error} - Throws an error if there is an issue generating the slug.
 * 
 * @example
 * // Example usage
 * const uniqueSlug = await generateSlugByTitle("My First Post");
 * console.log(uniqueSlug); // "my-first-post" or "my-first-post-2" if already exists
 */
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