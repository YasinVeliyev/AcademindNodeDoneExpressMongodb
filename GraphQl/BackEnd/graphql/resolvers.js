const User = require("../models/userModel");
const validator = require("validator");

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
};
