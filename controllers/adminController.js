const Product = require("../models/json/productModel");
const ProductMongo = require("../models/mongodb/productMongoModel");
const ProductMongooseModel = require("../models/mongoose/productMongooseModel");
const ProductMysqlModel = require("../models/mysql/productMysqlModel");
const productSequelizeModel = require("../models/mysql/productSequelizeModel");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editMode: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, price, imageUrl, description } = req.body;
    productSequelizeModel
        .create({
            title,
            price,
            imageUrl,
            description,
        })
        .then(res.redirect("/products"))
        .catch(err => console.error(err));
    // const product = new ProductMysqlModel(title, imageUrl, description, price);
    // product
    //     .save()
    //     .then(res.redirect("/products"))
    //     .catch((err) => console.log(err));
};

exports.getEditProduct = async (req, res, next) => {
    const editMode = req.query.editMode || false;
    const product = await productSequelizeModel.findByPk(req.params.productId);
    if (!product) {
        return res.status(404).render("404", {
            pageTitle: "Page Not Found",
            path: "404",
        });
    }
    res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editMode,
        product,
    });
};

exports.getProducts = async (req, res, next) => {
    productSequelizeModel
        .findAll()
        .then(products => {
            return res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
            });
        })
        .catch(err => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
    const { id, title, price, imageUrl, description } = req.body;
    productSequelizeModel
        .update({ title, price, imageUrl, description }, { where: { id } })
        .then(result => res.redirect("/admin/products", { isAuthenticated: req.isLoggedIn }))
        .catch(err => console.error(err));
};

exports.postDeleteProduct = async (req, res, next) => {
    await productSequelizeModel.destroy({ where: { id: req.body.id } });

    res.redirect("/admin/products", { isAuthenticated: req.isLoggedIn });
};
