const Product = require("../models/json/productModel");
const Cart = require("../models/json/cartModel");
const ProductMongo = require("../models/mongodb/productMongoModel");
const CartMongo = require("../models/mongodb/cartMongoModel");
const UserMango = require("../models/mongodb/userMongoModel");

async function ProductsInChart(userId) {
    let carts = await CartMongo.fetchAll(userId);
    let products;
    let totalPrice = 0;
    if (carts) {
        products = await Promise.all(
            carts.products.map(async (prod, index) => {
                let product = await ProductMongo.findById(prod.productId);
                product.id = index + 1;
                product.qty = prod.qty;
                totalPrice += prod.qty * product.price;
                return product;
            })
        );
    } else {
        products = [];
    }
    return { products, totalPrice };
}

exports.getProducts = async (req, res, next) => {
    let products = await ProductMongo.fetchAll();
    return res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
    });
};

exports.getIndex = async (req, res, next) => {
    let products = await ProductMongo.fetchAll();
    return res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
    });
};

exports.getCart = async (req, res, next) => {
    let { products: prods, totalPrice } = await ProductsInChart(
        req.cookies.user._id
    );
    res.render("shop/cart", {
        prods,
        totalPrice,
        userId: req.cookies.user._id,
        path: "/cart",
        pageTitle: "Your Cart",
    });
};

exports.postCart = async (req, res, nex) => {
    let chart = CartMongo.updateCart(req.cookies.user._id, req.body.productId);
    res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};

exports.getOrders = (req, res, next) => {
    console.log(req.cookies);
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Cart",
    });
};

exports.getProductDetailsById = async (req, res, next) => {
    const { productId } = req.params;
    let product = await ProductMongo.findById(productId);
    res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: `/products`,
    });
};

exports.postCartDeleteItem = (req, res, next) => {
    CartMongo.findAndDelete(req.cookies.user._id, req.body.productId);
    res.redirect("/cart");
};

exports.createOrder = async (req, res, next) => {
    let user = await UserMango.findById(req.body.userId);
    let data = await ProductsInChart(req.body.userId);
    data.user = user;
    await CartMongo.addOrder(data);
    res.redirect("/cart");
};
