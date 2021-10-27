const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: [6, "Must be at least 6, got {VALUE}"],
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Online",
    },
    posts: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Post",
        },
    ],
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        try {
            this.password = await bcrypt.hash(this.password, 12);
        } catch (error) {
            console.error(error);
        }
    }
    return next();
});

userSchema.method("checkPassword", function (password) {
    return bcrypt.compareSync(password, this.password);
});

module.exports = mongoose.model("User", userSchema);
