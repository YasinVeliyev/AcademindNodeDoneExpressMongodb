const Product = require("../models/productModel");
const ProductMongo = require("../models/productMongoModel");

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
    const product = new ProductMongo(title, imageUrl, description, price);
    product.save();
    res.setHeader("Content-Type", "text/html");
    res.redirect("/products");
};

exports.getEditProduct = async (req, res, next) => {
    const editMode = req.query.editMode || false;
    const product = await ProductMongo.findById(req.params.productId);
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
    let products = await ProductMongo.fetchAll();
    return res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
    });
};

exports.postEditProduct = (req, res, next) => {
    const { id, title, price, imageUrl, description } = req.body;
    ProductMongo.findAndUpdate(id, { title, price, imageUrl, description });
    res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
    ProductMongo.findAndDelete(req.body.id);
    res.redirect("/admin/products");
};
