const { validationResult } = require("express-validator");

const Post = require("../models/postModel");

exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems = await Post.find().countDocuments();
    Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .then(posts => {
            res.status(200).json({ message: "Fetched posts successfully.", posts: posts, totalItems });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect.");
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error("No Image provided");
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const { content, title } = req.body;
    try {
        const post = await Post.create({ title, content, imageUrl, creator: { name: "Yasin" } });

        return res.status(201).json({
            message: "Post created successfully!",
            post: post,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
        }
    }
};

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        let post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({ message: "Post fetched.", post: post });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.editPost = async (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect.");
        error.statusCode = 422;
        return next(error);
    }
    let { content, title, image: imageUrl } = req.body;
    const { postId } = req.params;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error("No file choosen");
        error.statusCode = 422;
        console.log(error);
        return next(error);
    }
    let updatedPost = await Post.findByIdAndUpdate(postId, { content, title, imageUrl }, { new: true });
    console.log(updatedPost);
    if (!updatedPost) {
        const error = new Error("Could not fint post.");
        error.statusCode = 404;
        console.log(error);
        return next(error);
    }
    return res.status(200).json({ message: "Post updated", post: updatedPost });
};

exports.deletePost = async (req, res, next) => {
    try {
        await Post.findByIdAndRemove(req.params.postId);
    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
};
