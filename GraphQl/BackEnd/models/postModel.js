const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

postSchema.pre(/^find/, async function (next) {
    this.populate("creator");
    return next();
});
postSchema.post("save", async function (doc) {
    return doc.populate("creator");
});

module.exports = mongoose.model("Post", postSchema);
