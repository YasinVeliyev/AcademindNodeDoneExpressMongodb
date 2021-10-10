const path = require("path");

const express = require("express");

// const productsController = require("../controllers/products");
const adminController = require("../controllers/adminController");
const middleware = require("../middleware/isAuth");

const router = express.Router();

router.get("/add-product", middleware.userIsAuthenticated, adminController.getAddProduct);
router.get("/edit-product/:productId", middleware.userIsAuthenticated, adminController.getEditProduct);
router.post("/edit-product", middleware.userIsAuthenticated, adminController.postEditProduct);
router.post("/delete-product", middleware.userIsAuthenticated, adminController.postDeleteProduct);
router.get("/products", middleware.userIsAuthenticated, adminController.getProducts);
router.post("/add-product", middleware.userIsAuthenticated, adminController.postAddProduct);

module.exports = router;
