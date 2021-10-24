const path = require("path");

const express = require("express");

// const productsController = require("../controllers/products");
const adminController = require("../controllers/adminController");
const middleware = require("../middleware/isAuth");

const router = express.Router();

router.get("/add-product", middleware.userIsAuthenticated, adminController.getAddProduct);
router.get("/edit-product/:productId", middleware.userIsAuthenticated, adminController.getEditProduct);
router.post("/edit-product", middleware.userIsAuthenticated, adminController.postEditProduct);
router.delete("/product/:productId", middleware.userIsAuthenticated, adminController.deleteProduct);
router.get("/products", middleware.userIsAuthenticated, adminController.getProducts);
router.post("/add-product", middleware.userIsAuthenticated, adminController.postAddProduct);

module.exports = router;
