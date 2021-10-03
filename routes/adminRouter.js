const path = require("path")

const express = require("express")

// const productsController = require("../controllers/products");
const adminController = require("../controllers/adminController")

const router = express.Router()

router.get("/add-product", adminController.getAddProduct)
router.get("/edit-product/:productId", adminController.getEditProduct)
router.post("/edit-product", adminController.postEditProduct)
router.post("/delete-product", adminController.postDeleteProduct)
router.get("/products", adminController.getProducts)
router.post("/add-product", adminController.postAddProduct)

module.exports = router
