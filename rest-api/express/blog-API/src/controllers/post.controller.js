import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import Post from '../models/post.model.js';
import Category from '../models/category.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import { generateSlugByTitle } from '../utils/generate.slug.js';
import { deleteImageOnCloudinary } from '../utils/cloudinary.js';


export const getAllPosts = asyncHandler(async (req, res, next) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    const search = req.query.search;
    const category = req.query.category;

    if (isNaN(page) || page < 1) page = 1; // Default page is 1
    if (isNaN(limit) || limit < 1) limit = 15; // Default limit is 5

    // If User input the search query
    let searchQuery = {};
    if (search) {

        searchQuery = {
            $or: [
                { title: { $regex: search, $options: "i" } }, // Search based on title
                { subtitle: { $regex: search, $options: "i" } }, // Search based on subtitle
            ]

        }
    }

    // If User input the category query
    if (category) {
        searchQuery.category = category; // Filter berdasarkan kategori (harus sesuai dengan schema Post)
    }

    // Calculate the total number of products based on the search query
    const totalPost = await Post.countDocuments(searchQuery);
    const lastPage = Math.ceil(totalPost / limit);


    const posts = await Post.find(searchQuery)
    .select('-content')
        .populate('category', 'name')
        .populate('author', '-password -refreshToken')
        .skip((page - 1) * limit)
        .limit(limit);

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

