const express = require("express");

const authController = require("../controllers/authController");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.postLogout);
router.use("/signup", authController.signup);
module.exports = router;
