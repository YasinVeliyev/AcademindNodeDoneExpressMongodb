const Product = require("../models/json/productModel");
const Cart = require("../models/json/cartModel");
const ProductMongo = require("../models/mongodb/productMongoModel");
const ProductMongoose = require("../models/mongoose/productMongooseModel");
const CartMongo = require("../models/mongodb/cartMongoModel");
const UserMango = require("../models/mongodb/userMongoModel");
const userMongooseModel = require("../models/mongoose/userMongooseModel");
const ProductMysqlModel = require("../models/mysql/productMysqlModel");
const productSequelizeModel = require("../models/mysql/productSequelizeModel");

exports.getProducts = async (req, res, next) => {
    productSequelizeModel
        .findAll()
        .then((products) => {
            return res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products",
                path: "/",
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
            });
        })
        .catch((err) => console.error(err));
};

exports.getIndex = async (req, res, next) => {
    productSequelizeModel
        .findAll()
        .then((products) => {
            return res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
            });
        })
        .catch((err) => console.error(err));
};

exports.getCart = async (req, res, next) => {
    let user = await userMongooseModel.findById(req.cookies.user._id);
    let [prods, totalPrice] = user.getItems();
    res.render("shop/cart", {
        prods,
        totalPrice,
        userId: req.cookies.user._id,
        path: "/cart",
        pageTitle: "Your Cart",
    });
};

exports.postCart = async (req, res, nex) => {
    let user = await userMongooseModel.findById(req.cookies.user._id);
    let product = ProductMongoose.findById(req.body.productId, (err, data) => {
        user.addItemtoChart(data);
    });

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
    productSequelizeModel.findByPk(productId).then((product) => {
        console.log(product.dataValues);
        return res.render("shop/product-detail", {
            product,
            pageTitle: product.title,
            path: `/products`,
        });
    });
};

exports.postCartDeleteItem = (req, res, next) => {
    userMongooseModel.findById(req.cookies.user._id, (err, user) => {
        user.deleteItemFromChart(req.body.productId);
    });
    res.redirect("/cart");
};

exports.createOrder = async (req, res, next) => {
    let user = await UserMango.findById(req.body.userId);
    let data = await ProductsInChart(req.body.userId);
    data.user = user;
    await CartMongo.addOrder(data);
    res.redirect("/cart");
};
