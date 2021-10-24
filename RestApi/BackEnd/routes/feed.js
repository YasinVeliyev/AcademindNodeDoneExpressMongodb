const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feedController");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = express.Router();

let validator = [body("title").trim().isLength({ min: 7 }), body("content").trim().isLength({ min: 5 })];

router.get("/posts", isAuthenticated, feedController.getPosts);

router.post("/post", isAuthenticated, validator, feedController.createPost);

router
    .route("/post/:postId")
    .get(isAuthenticated, feedController.getPost)
    .put(isAuthenticated, validator, feedController.editPost)
    .delete(isAuthenticated, feedController.deletePost);

module.exports = router;
