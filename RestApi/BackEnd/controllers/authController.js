const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed");
        error.statusCode = 422;
        error.data = errors.array();
        console.log(error);
        throw error;
    }
    const { email, name, password } = req.body;
    User.create({ email, name, password })
        .then(user => res.status(201).json({ message: "User created", userId: user._id, authData: user }))
        .catch(err => next(err));
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user && user.checkPassword(password)) {
            const token = user.generateToken();
            res.status(200).json({ token, userId: user._id.toString() });
        } else {
            const error = new Error("User is not exist or Wrong password");
            error.statusCode = 401;
            throw error;
        }
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

exports.updateStatus = (req, res, next) => {
    console.log(req.body);
    User.findByIdAndUpdate(req.userId, { status: req.body.status }, { new: true })
        .then(user => {
            return res.status(201).json({ user });
        })
        .catch(err => {
            err.statusCode = 500;
            next(err);
        });
};
