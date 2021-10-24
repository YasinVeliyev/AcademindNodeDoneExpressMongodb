const { Router } = require("express");
const { body } = require("express-validator");

const User = require("../models/userModel");
const authController = require("../controllers/authController");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = Router();

let validator = [
    body("name").trim(),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom(async (value, { req }) => {
            return (await User.findOne({ email: value })) || false;
        })
        .withMessage("E-mail already in use"),
    body("password").isLength({ min: 6 }),
];

router.put("/signup", validator, authController.signup);
router.post("/login", authController.login);
router.patch("/updateStatus", isAuthenticated, authController.updateStatus);
module.exports = router;
