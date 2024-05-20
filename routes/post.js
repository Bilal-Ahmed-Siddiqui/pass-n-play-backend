const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");

router.post("/", (req, res) => {
  res.send("post ep");
});

//fetch all post, GET, '/api/post/fetchall', doesnt required auth
router.get("/fetchall", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

//create post, POST, '/api/post/create', requires auth
router.post(
  "/create",
  fetchUser,
  [
    body("title", "Title can not be empty").not().isEmpty(),
    body("description", "Description can not be empty").not().isEmpty(),
    body("rentPeriod", "Rent period can not be empty").not().isEmpty(),
    body("location", "Location can not be empty").not().isEmpty(),
    body("condition", "Condition can not be empty").not().isEmpty(),
    body("rentPrice", "Rent Price can not be empty").not().isEmpty(),
    body("depositPrice", "deposit Price can not be empty").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }
      const {
        title,
        description,
        rentPeriod,
        location,
        condition,
        rentPrice,
        depositPrice,
      } = req.body;

      const newPost = Post({
        user: req.user.id,
        title,
        description,
        rentPeriod,
        location,
        condition,
        rentPrice,
        depositPrice,
      });
      newPost.save();

      res.send("Post Uploaded!");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error!");
    }
  }
);

// fetch user posts, GET, '/api/post/userposts'
router.get("/userposts", fetchUser, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

// fetch post by id, GET, '/api/post/id'
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

// Update user post, PUT, '/api/post/update/:id'
router.put(
  "/update/:id",
  fetchUser,
  [
    body("title", "Title can not be empty").not().isEmpty(),
    body("description", "Description can not be empty").not().isEmpty(),
    body("rentPeriod", "Rent period can not be empty").not().isEmpty(),
    body("location", "Location can not be empty").not().isEmpty(),
    body("condition", "Condition can not be empty").not().isEmpty(),
    body("rentPrice", "Rent Price can not be empty").not().isEmpty(),
    body("depositPrice", "deposit Price can not be empty").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }
      let post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send("Post Not Found!");
      }
      if (req.user.id !== post.user.toString()) {
        return res.status(401).send("UnAuthorized Access!");
      }

      const {
        title,
        description,
        rentPeriod,
        location,
        condition,
        rentPrice,
        depositPrice,
      } = req.body;
      const updatedPost = {
        user: req.user.id,
        title,
        description,
        rentPeriod,
        location,
        condition,
        rentPrice,
        depositPrice,
      };

      post = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: updatedPost },
        { new: true }
      );

      res.send("post updated");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error!");
    }
  }
);

// delete user post, delete, '/api/post/delete/:id'
router.delete("/delete/:id", fetchUser, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post Not Found!");
    }
    if (req.user.id !== post.user.toString()) {
      return res.status(401).send("UnAuthorized Access!");
    }
    post = await Post.findByIdAndDelete(req.params.id);
    res.send("post deleted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

module.exports = router;
