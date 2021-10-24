const mongoose = require("mongoose");

const chartSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
        },
        quantity: { type: Number, required: true },
    },
    { _id: false }
);
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cart: [chartSchema],
});

userSchema.pre(/^find/, async function () {
    this.populate({
        path: "cart.productId",
    });
});

userSchema.methods.getItems = function () {
    let totalPrice = 0;
    if (!this.cart.length) {
        return [[], totalPrice];
    }
    return [
        this.cart.map((product, index) => {
            totalPrice += product.quantity * product.productId.price;
            let prod = {};
            prod.id = index + 1;
            prod.title = product.productId.title;
            prod.description = product.productId.description;
            prod.imageUrl = product.productId.imageUrl;
            prod.price = product.productId.price;
            prod.qty = product.quantity;
            prod._id = product.productId._id;
            return prod;
        }),
        totalPrice,
    ];
};

userSchema.methods.addItemtoChart = function (item) {
    let product = this.cart.filter(prod => {
        if (prod.productId._id.toString() == item._id.toString()) {
            prod.quantity++;
            return prod;
        }
    });
    if (!product.length) {
        this.cart.push({ productId: item, quantity: 1 });
    }
    return this.save();
};

userSchema.methods.deleteItemFromChart = function (productId) {
    this.cart = this.cart.filter(prod => prod.productId._id.toString() != productId);
    this.save();
};

module.exports = mongoose.model("User", userSchema);
