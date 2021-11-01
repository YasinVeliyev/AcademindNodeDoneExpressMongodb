const User = require("../models/userModel");
const Post = require("../models/postModel");
const validator = require("validator");
const { getPossibleTypes } = require("./schema");
const { clearImage } = require("../util/file");

module.exports = {
    async createUser(args, req) {
        let errors = [];
        const { email, name, password } = args.userInput;
        if (!validator.isEmail(email)) {
            errors.push({ message: "Email is invalid" });
        }
        if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
            errors.push({ message: "Password too short" });
        }
        if (validator.isEmpty(name) || !validator.isLength(name, { min: 2 })) {
            errors.push({ message: "Name too short" });
        }
        if (errors.length > 0) {
            const error = new Error("Invalid input");
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User exists already");

            throw error;
        }
        let user = await User.create({ email, name, password });
        return { ...user._doc, _id: user._id.toString() };
    },
    async login(args, req) {
        let { email, password } = args;
        const user = await User.findOne({ email });
        if (user && (await user.checkPassword(password))) {
            const token = user.generateToken();
            return { token, userId: user._id.toString() };
        }
        const error = new Error("Invalid Credentials");
        error.code = 401;
        throw error;
    },
    async createPost(args, req) {
        if (!req.isAuth) {
            const error = new Error("Not Authenticated");
            error.code = 401;
            throw error;
        }
        const { title, content, imageUrl } = args.postInput;
        const errors = [];
        if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
            errors.push({ message: "Title is invalid" });
        }
        if (validator.isEmpty(content) || !validator.isLength(content, { min: 25 })) {
            errors.push({ message: "Content is invalid" });
        }
        if (errors.length > 0) {
            const error = new Error("Invalid input");
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error("Invalid user");
            error.code = 401;
            throw error;
        }
        console.log(args.postInput);
        let post = await Post.create({ title, content, imageUrl, creator: user._id });
        user.posts.push(post);
        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
            creator: post.creator,
        };
    },

    async posts(args, req) {
        let { page } = args;
        const perPage = 2;
        if (!req.isAuth) {
            const error = new Error("Not Authenticated");
            error.code = 401;
            throw error;
        }
        if (!page) {
            page = 1;
        }

        const totalPosts = await Post.find().countDocuments();
        const posts = await (
            await Post.find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage)
        ).map(p => {
            return {
                ...p._doc,
                _id: p._id.toString(),
                createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString(),
            };
        });
        return { posts, totalPosts };
    },

    async post({ id }, req) {
        if (!req.isAuth) {
            const error = new Error("Not Authenticated");
            error.code = 401;
            throw error;
        }

        let post = await Post.findById(id);
        if (!post) {
            const error = new Error("Post not find");
            error.status = 404;
            throw error;
        }
        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        };
    },
    async updatePost({ id, postInput }, req) {
        if (!req.isAuth) {
            const error = new Error("Not Authenticated");
            error.code = 401;
            throw error;
        }
        let post = await Post.findOneAndUpdate({ _id: id, creator: req.userId }, postInput, { new: true });
        console.log(post);
        if (!post) {
            const error = new Error("Post not find or You are not authorized");
            error.status = 404;
            throw error;
        }
        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        };
    },

    async deletePost({ id }, req) {
        if (!req.isAuth) {
            const error = new Error("Not Authenticated");
            error.code = 401;
            throw error;
        }
        try {
            let deletedPost = await Post.findOneAndDelete({ _id: id, creator: req.userId });
            clearImage(deletedPost.imageUrl);
        } catch (err) {
            const error = new Error("Post not find or You are not authorized");
            error.status = 404;
            throw error;
        }
        return true;
    },
    async user(args, req) {
        if (!req.isAuth) {
            const error = new Error("Not Authenticated");
            error.code = 401;
            throw error;
        }
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error("User not find");
            error.status = 404;
            throw error;
        }
        return { ...user._doc, _id: user._id.toString() };
    },

    async updateStatus({ status }, req) {
        if (!req.isAuth) {
            const error = new Error("Not Authenticated");
            error.code = 401;
            throw error;
        }
        const user = await User.findByIdAndUpdate(req.userId, { status });
        if (!user) {
            const error = new Error("User not find");
            error.status = 404;
            throw error;
        }
        return { ...user._doc, _id: user._id.toString() };
    },
};
