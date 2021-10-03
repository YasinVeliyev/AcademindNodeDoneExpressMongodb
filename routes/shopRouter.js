const path = require("path");

const express = require("express");

const shopController = require("../controllers/shopController");

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/cart", shopController.getCart);
router.post("/add-to-cart", shopController.postCart);
router.get("/orders", shopController.getOrders);
router.get("/checkout", shopController.getCheckout);
router.get("/products/:productId", shopController.getProductDetailsById);
router.post("/cart-delete-item", shopController.postCartDeleteItem);
router.post("/create-order", shopController.createOrder);
module.exports = router;
