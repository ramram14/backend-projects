import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import Post from '../models/post.model.js';
import Category from '../models/category.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import { generateSlugByTitle } from '../utils/generate.slug.js';
import { deleteImageOnCloudinary } from '../utils/cloudinary.js';

/**
 * Fetch all posts with optional search, category filter, and pagination.
 * 
 * This function retrieves posts from the database based on query parameters such as `search`, 
 * `category`, and pagination (`page` and `limit`). It returns a paginated list of posts along with 
 * metadata about the total number of posts, the current page, and links to navigate through the pages.
 * 
 * @async
 * @function getAllPosts
 * @param {Object} req - The request object containing query parameters and other request data.
 * @param {Object} res - The response object used to send back the results.
 * @param {Function} next - The next middleware function to pass control to in case of an error.
 * @throws {ApiError} 400 - If page or limit is invalid.
 * @returns {void} Responds with a 200 status code and a paginated list of posts along with metadata.
 */
export const getAllPosts = asyncHandler(async (req, res, next) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    const search = req.query.search;
    const category = req.query.category;

    // Default values for page and limit if they are invalid
    if (isNaN(page) || page < 1) page = 1; // Default page is 1
    if (isNaN(limit) || limit < 1) limit = 15; // Default limit is 5

    // Build search query if 'search' query parameter is provided
    let searchQuery = {};
    if (search) {

        searchQuery = {
            $or: [
                { title: { $regex: search, $options: "i" } }, // Search based on title
                { subtitle: { $regex: search, $options: "i" } }, // Search based on subtitle
            ]

        }
    }

    // Add category filter if 'category' query parameter is provided
    if (category) {
        searchQuery.category = category; // Filter by category
    }

    // Calculate the total number of products based on the search query
    const totalPost = await Post.countDocuments(searchQuery);
    const lastPage = Math.ceil(totalPost / limit);

    // Fetch posts with the search and category filters, pagination, and populating relationships
    const posts = await Post.find(searchQuery)
        .select('-content') // Exclude content field for security or performance
        .populate('category', 'name') // Populate category field with its name
        .populate('author', '-password -refreshToken') // Populate author but exclude sensitive fields
        .skip((page - 1) * limit) // Pagination: skip posts based on current page
        .limit(limit); // Limit the number of posts per page

    // Respond with paginated results and metadata
    return res.status(200).json(new ApiResponse(200, 'Posts fetched successfully', {
        posts,
        total: totalPost,
        per_page: limit,
        current_page: page,
        first_page: 1,
        last_page: lastPage,
        first_page_url: `/?page=1&limit=${limit}&search=${search || ""}&category=${category || ""}`,
        last_page_url: `/?page=${lastPage}&limit=${limit}&search=${search || ""}&category=${category || ""}`,
        next_page_url: page < lastPage ? `/?page=${page + 1}&limit=${limit}&search=${search || ""}&category=${category || ""}` : null,
        prev_page_url: page > 1 ? `/?page=${page - 1}&limit=${limit}&search=${search || ""}&category=${category || ""}` : null,
    }));
});

/**
 * Fetch a post by its slug.
 * 
 * This function retrieves a single post from the database using the `slug` parameter from the 
 * request's route. It also populates the related `category` and `author` fields for additional 
 * context. If the post is not found, it returns a 404 error.
 * 
 * @async
 * @function getPostbySlug
 * @param {Object} req - The request object containing the `slug` parameter in the URL.
 * @param {Object} res - The response object used to send back the retrieved post.
 * @param {Function} next - The next middleware function to pass control to in case of an error.
 * @throws {ApiError} 404 - If the post with the provided slug is not found.
 * @returns {void} Responds with a 200 status code and the post data if found.
 */
export const getPostbySlug = asyncHandler(async (req, res, next) => {
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
        .populate('category', 'name')
        .populate('author', '-password -refreshToken');

    if (!post) {
        return next(new ApiError(404, 'Post not found'));
    }

    return res.status(200).json(new ApiResponse(200, 'Post fetched successfully', post));
});

/**
 * Fetch all comments for a post by its slug.
 * 
 * This function retrieves all comments for a post identified by the `slug` parameter from the 
 * request's route. It also populates the `user` for each comment and replies, including the 
 * `user` information for the replies, excluding sensitive fields. If the post is not found, 
 * it returns a 404 error.
 * 
 * @async
 * @function getPostCommentsBySlug
 * @param {Object} req - The request object containing the `slug` parameter in the URL.
 * @param {Object} res - The response object used to send back the list of comments for the post.
 * @param {Function} next - The next middleware function to pass control to in case of an error.
 * @throws {ApiError} 404 - If the post with the provided slug is not found.
 * @returns {void} Responds with a 200 status code and the list of comments if found.
 */
export const getPostCommentsBySlug = asyncHandler(async (req, res, next) => {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });
    if (!post) {
        return next(new ApiError(404, 'Post not found'));
    }

    const postComments = await Comment.find({ post: post._id })
        .populate('user', '-password -refreshToken')
        .populate({
            path: 'replies',
            populate: {
                path: 'user',
                select: '-password -refreshToken'
            }
        })

    return res.status(200).json(new ApiResponse(200, 'Post fetched successfully', postComments));
});

/**
 * Create a new post.
 * 
 * This function allows a user to create a new post by providing required fields such as title,
 * subtitle, content, image, and category. It first verifies if the user exists and checks if 
 * the provided category exists in the system. If everything is valid, it generates a slug based 
 * on the title and creates the new post. If any required field is missing, or the category does not exist, 
 * an error is returned. If successful, a 201 status is returned with the created post.
 * 
 * @async
 * @function createPost
 * @param {Object} req - The request object containing the user data and post details.
 * @param {Object} res - The response object used to send back the newly created post.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or category is not found.
 * @throws {ApiError} 400 - If any required field (title, subtitle, content, image, category) is missing.
 * @returns {void} Responds with a 201 status code and the created post data.
 */
export const createPost = asyncHandler(async (req, res, next) => {

    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { title, subtitle, content, image, category } = req.body;
    if (!title || !subtitle || !content || !image || !category) {
        return next(new ApiError(400, 'All fields are required', 'Title, subtitle, content, image, and category are required'));
    }

    const isCategoryExists = await Category.findOne({ name: category });
    if (!isCategoryExists) {
        return next(new ApiError(404, 'Category not found'));
    }

    const slug = await generateSlugByTitle(title);

    const post = await Post.create({
        title,
        subtitle,
        content,
        image,
        slug,
        author: user._id,
        category: isCategoryExists._id
    });

    return res.status(201).json(new ApiResponse(201, 'Post created successfully', post));

});

/**
 * Update the title of a post.
 * 
 * This function allows the user to update the title of an existing post. It first checks if the user exists 
 * and whether the post belongs to the logged-in user. If the user is authorized and a title is provided, 
 * the title and slug of the post are updated. If the post or user is not found, or the user is not authorized, 
 * an error is returned. If successful, a 200 status code is returned with the updated post.
 * 
 * @async
 * @function updatePostTitle
 * @param {Object} req - The request object containing the user ID, post ID, and new title.
 * @param {Object} res - The response object used to send back the updated post.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or post is not found.
 * @throws {ApiError} 403 - If the user is not authorized to update the post.
 * @throws {ApiError} 400 - If the title is missing.
 * @returns {void} Responds with a 200 status code and the updated post data.
 */
export const updatePostTitle = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
        return next(new ApiError(404, 'Post not found'));
    }
    if (post.author.toString() !== user._id.toString()) {
        return next(new ApiError(403, 'You are not authorized to update this post'));
    }


    const { title } = req.body;
    if (!title) {
        return next(new ApiError(400, 'All fields are required', 'Title is required'));
    }

    const newSlug = await generateSlugByTitle(title);

    post.title = title;
    post.slug = newSlug;
    await post.save();

    return res.status(200).json(new ApiResponse(200, 'Post updated successfully', post));
});

/**
 * Update the content and subtitle of a post.
 * 
 * This function allows the user to update the subtitle and/or content of an existing post. It first checks if 
 * the user exists and whether the post belongs to the logged-in user. If the user is authorized and at least 
 * one of the fields (subtitle or content) is provided, the post is updated. If the post or user is not found, 
 * or the user is not authorized, an error is returned. If successful, a 200 status code is returned with the updated post.
 * 
 * @async
 * @function updatePostContentAndSubtitle
 * @param {Object} req - The request object containing the user ID, post ID, and new subtitle and/or content.
 * @param {Object} res - The response object used to send back the updated post.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or post is not found.
 * @throws {ApiError} 403 - If the user is not authorized to update the post.
 * @throws {ApiError} 400 - If neither subtitle nor content is provided.
 * @returns {void} Responds with a 200 status code and the updated post data.
 */
export const updatePostContentAndSubtitle = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        return next(new ApiError(404, 'Post not found'));
    }
    if (post.author.toString() !== user._id.toString()) {
        return next(new ApiError(403, 'You are not authorized to update this post'));
    }

    const { subtitle, content } = req.body;
    if (!subtitle && !content) {
        return next(new ApiError(400, 'At least one field is required', 'Subtitle or content is required'));
    }

    post.subtitle = subtitle || post.subtitle;;
    post.content = content || post.content;
    await post.save();

    return res.status(200).json(new ApiResponse(200, 'Post updated successfully', post));
});

/**
 * Update the image of a post.
 * 
 * This function allows the user to update the image of an existing post. It first checks if the user exists and whether 
 * the post belongs to the logged-in user. If the user is authorized and the new image is provided, the old image is 
 * deleted from Cloudinary, and the post's image is updated. If the post or user is not found, or the user is not authorized, 
 * an error is returned. If successful, a 200 status code is returned with the updated post.
 * 
 * @async
 * @function updatePostImage
 * @param {Object} req - The request object containing the user ID, post ID, and the new image.
 * @param {Object} res - The response object used to send back the updated post.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or post is not found.
 * @throws {ApiError} 403 - If the user is not authorized to update the post.
 * @throws {ApiError} 400 - If the image field is not provided.
 * @returns {void} Responds with a 200 status code and the updated post data.
 */
export const updatePostImage = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        return next(new ApiError(404, 'Post not found'));
    }
    if (post.author.toString() !== user._id.toString()) {
        return next(new ApiError(403, 'You are not authorized to update this post'));
    }

    const { image } = req.body;
    if (!image) {
        return next(new ApiError(400, 'All fields are required', 'Image is required'));
    }

    // delete old image from cloudinary
    await deleteImageOnCloudinary(post.image);

    post.image = image;
    await post.save();

    return res.status(200).json(new ApiResponse(200, 'Post updated successfully', post));
});

/**
 * Update the category of a post.
 * 
 * This function allows the user to update the category of an existing post. It checks if the user exists and if the post 
 * belongs to the logged-in user. If the user is authorized, the function validates if the provided category exists. If 
 * valid, the category is updated, and the post is saved with the new category. If any error occurs, an appropriate error is returned.
 * 
 * @async
 * @function updatePostCategory
 * @param {Object} req - The request object containing the user ID, post ID, and the new category.
 * @param {Object} res - The response object used to send back the updated post.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or post is not found.
 * @throws {ApiError} 403 - If the user is not authorized to update the post.
 * @throws {ApiError} 400 - If the category field is not provided.
 * @throws {ApiError} 404 - If the provided category does not exist.
 * @returns {void} Responds with a 200 status code and the updated post data.
 */
export const updatePostCategory = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        return next(new ApiError(404, 'Post not found'));
    }
    if (post.author.toString() !== user._id.toString()) {
        return next(new ApiError(403, 'You are not authorized to update this post'));
    }

    const { category } = req.body;
    if (!category) {
        return next(new ApiError(400, 'All fields are required', 'Category is required'));
    }

    const isCategoryExists = await Category.findOne({ name: category });
    if (!isCategoryExists) {
        return next(new ApiError(404, 'Category not found'));
    }

    post.category = isCategoryExists._id;
    await post.save();

    return res.status(200).json(new ApiResponse(200, 'Post updated successfully', post));
});

/**
 * Delete a post.
 * 
 * This function allows the user to delete an existing post. It first checks if the user exists and if the post belongs to
 * the logged-in user. If the user is authorized, the post is deleted from the database. If any error occurs, an appropriate error is returned.
 * 
 * @async
 * @function deletePost
 * @param {Object} req - The request object containing the user ID and the post ID to be deleted.
 * @param {Object} res - The response object used to send back the success message once the post is deleted.
 * @param {Function} next - The next middleware function to handle errors.
 * @throws {ApiError} 404 - If the user or post is not found.
 * @throws {ApiError} 403 - If the user is not authorized to delete the post.
 * @returns {void} Responds with a 200 status code and a success message after deletion.
 */
export const deletePost = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
        return next(new ApiError(404, 'Post not found'));
    }
    if (post.author.toString() !== user._id.toString()) {
        return next(new ApiError(403, 'You are not authorized to delete this post'));
    }

    return res.status(200).json(new ApiResponse(200, 'Post deleted successfully'));
});

