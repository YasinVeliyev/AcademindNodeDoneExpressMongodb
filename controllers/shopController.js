const fs = require("fs");
const path = require("path");
const pdfkit = require("pdfkit");

const Product = require("../models/json/productModel");
const Cart = require("../models/json/cartModel");
const ProductMongo = require("../models/mongodb/productMongoModel");
const ProductMongoose = require("../models/mongoose/productMongooseModel");
const CartMongo = require("../models/mongodb/cartMongoModel");
const UserMango = require("../models/mongodb/userMongoModel");
const userMongooseModel = require("../models/mongoose/userMongooseModel");
const ProductMysqlModel = require("../models/mysql/productMysqlModel");
const productSequelizeModel = require("../models/mysql/productSequelizeModel");
const orderItem = require("../models/mysql/order-item");
const orderSequelizeModel = require("../models/mysql/orderSequelizeModel");
const userSequelizeModel = require("../models/mysql/userSequelizeModel");
const cartSequelizeModel = require("../models/mysql/cartSequelizeModel");

exports.getProducts = async (req, res, next) => {
    productSequelizeModel
        .findAll()
        .then(products => {
            return res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products",
                path: "/",
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
            });
        })
        .catch(err => console.error(err));
};

exports.getIndex = async (req, res, next) => {
    try {
        let { count, rows: products } = await productSequelizeModel.findAndCountAll({
            where: {},
            limit: 4,
            offset: (req.query.page - 1) * 4,
        });
        console.log(count);
        return res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true,
            message: req.flash("info"),
            paginate: Math.ceil(count / 4),
            currentPage: req.query.page,
        });
    } catch (err) {
        // console.log(count);
        // productSequelizeModel
        //     .findAll()
        //     .then(products => {
        //         return res.render("shop/index", {
        //             prods: products,
        //             pageTitle: "Shop",
        //             path: "/",
        //             hasProducts: products.length > 0,
        //             activeShop: true,
        //             productCSS: true,
        //             message: req.flash("info"),
        //         });
        //     })
        console.error(err);
    }
};

exports.getCart = async (req, res, next) => {
    console.log(req.session.user.id);
    userSequelizeModel
        .findByPk(req.session.user.id)
        .then(user => user.getCart())
        .then(cart => {
            return cart.getProducts().then(products => {
                let totalPrice = products.reduce((a, b) => a + b.price * b.cartItem.quantity, 0);
                res.render("shop/cart", {
                    prods: products,
                    totalPrice,
                    userId: req.session.user.id,
                    path: "/cart",
                    pageTitle: "Your Cart",
                });
            });
        })
        .catch(err => {
            res.render("shop/cart", {
                prods: [],
                userId: req.session.user.id,
                path: "/cart",
                pageTitle: "Your Cart",
            });
            console.error(err);
        });
};

exports.postCart = async (req, res, nex) => {
    let fetchedCart;
    let User;
    const { productId } = req.body;
    userSequelizeModel
        .findByPk(req.session.user.id)
        .then(user => {
            User = user;
            return user.getCart();
        })
        .then(cart => {
            if (cart) {
                fetchedCart = cart;
                return cart.getProducts({ where: { id: req.body.productId } });
            } else {
                let fetchedCart = cartSequelizeModel.create({ userId: User.id }).then(cart => {
                    productSequelizeModel.findByPk(productId).then(product => {
                        cart.addProduct(product, {
                            through: { quantity: 1 },
                        });
                    });
                });
                return res.redirect("/cart");
            }
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            let newQuantity = 1;
            if (product) {
                newQuantity = product.cartItem.quantity + 1;
            }
            return productSequelizeModel.findByPk(productId).then(product => {
                fetchedCart.addProduct(product, {
                    through: { quantity: newQuantity },
                });
            });
        })
        .catch(err => console.error(err));

    res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
    });
};

exports.getProductDetailsById = async (req, res, next) => {
    const { productId } = req.params;
    productSequelizeModel.findByPk(productId).then(product => {
        return res.render("shop/product-detail", {
            product,
            pageTitle: product.title,
            path: `/products`,
        });
    });
};

exports.postCartDeleteItem = (req, res, next) => {
    userSequelizeModel
        .findByPk(req.session.user.id)
        .then(user => user.getCart())
        .then(cart => {
            return cart.getProducts({ where: { id: req.body.productId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => res.redirect("/cart"))
        .catch(err => console.error(err));
};

exports.createOrder = async (req, res, next) => {
    try {
        let user = await userSequelizeModel.findByPk(req.session.user.id);
        let cart = await user.getCart();
        let products = await cart.getProducts();
        let order = await user.createOrder();
        order.addProducts(
            products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            })
        );

        await cart.setProducts(null);
        res.redirect("/orders");
    } catch (error) {
        console.error(error);
    }
};

exports.getOrders = async (req, res, next) => {
    let user = await userSequelizeModel.findByPk(req.session.user.id);
    let orders = await user.getOrders({ include: ["products"] });
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
    });
};

exports.getInvoice = async (req, res, next) => {
    const orderId = req.params.orderId;
    let user = await userSequelizeModel.findByPk(req.session.user.id);
    let orders = await user.getOrders({ include: ["products"] });
    let ordersInvoice = [];
    let totalPrice = 0;
    orders.forEach(order => {
        if (order.id == orderId) {
            let products = order.dataValues.products.forEach(product => {
                let { title, price } = product;
                let quantity = product.orderItem.quantity;
                totalPrice += price * quantity;
                ordersInvoice.push({ title, price, quantity });
            });
        }
    });
    if (ordersInvoice.length > 0) {
        const invoiceName = "invoice-" + orderId + ".pdf";
        const invoicePath = path.join("data", "invoices", invoiceName);
        const pdfDoc = new pdfkit();
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");

        pdfDoc.fontSize(26).text("Invoice", {
            underline: true,
        });
        pdfDoc.text("________________________________");
        ordersInvoice.forEach(order => {
            pdfDoc.text(order.title + " - " + order.quantity + " x " + order.price + " $");
        });
        pdfDoc.text("________________________________");
        pdfDoc.text("Total Price: " + " = " + totalPrice + " $");
        pdfDoc.end();
        return pdfDoc.pipe(res);
    }
    return next(new Error("No order"));
};
