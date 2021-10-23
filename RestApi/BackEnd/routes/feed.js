const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feedController");

const router = express.Router();

let validator = [body("title").trim().isLength({ min: 7 }), body("content").trim().isLength({ min: 5 })];

router.get("/posts", feedController.getPosts);

router.post("/post", validator, feedController.createPost);

router
    .get("/post/:postId", feedController.getPost)
    .put("/post/:postId", validator, feedController.editPost)
    .delete(feedController.deletePost);

module.exports = router;
