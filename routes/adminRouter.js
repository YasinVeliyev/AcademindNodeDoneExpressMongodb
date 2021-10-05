const path = require("path");

const express = require("express");

// const productsController = require("../controllers/products");
const adminController = require("../controllers/adminController");

const router = express.Router();
const userIsAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    next();
};

router.get("/add-product", userIsAuthenticated, adminController.getAddProduct);
router.get("/edit-product/:productId", userIsAuthenticated, adminController.getEditProduct);
router.post("/edit-product", userIsAuthenticated, adminController.postEditProduct);
router.post("/delete-product", userIsAuthenticated, adminController.postDeleteProduct);
router.get("/products", userIsAuthenticated, adminController.getProducts);
router.post("/add-product", userIsAuthenticated, adminController.postAddProduct);

module.exports = router;
