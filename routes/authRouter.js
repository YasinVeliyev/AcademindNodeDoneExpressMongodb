const express = require("express");
const { check, body } = require("express-validator");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
    "/login",
    check("email").isEmail().withMessage("Please enter a valid email"),
    body("password", "Please enter a password with onlu numbers and text at least 6 characters"),
    authController.postLogin
);
router.get("/logout", authController.postLogout);
router
    .route("/signup")
    .get(authController.signup)
    .post(
        check("email").isEmail().withMessage("Please enter a valid email"),
        body("password")
            .isLength({ min: 6 }, "Please enter a password with onlu numbers and text at least 6 characters")
            .isAlphanumeric(),
        body("confirmpassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords have to match!");
            }
            return true;
        }),
        authController.signup
    );
router.route("/reset").get(authController.getReset).post(authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
module.exports = router;
