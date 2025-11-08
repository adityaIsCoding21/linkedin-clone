const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");
const multer = require("multer");

// Image Upload Setup
const upload = multer({ dest: "public/uploads/" });

// Create Post (with optional image)
router.post("/create", auth, upload.single("image"), async (req, res) => {
  try {
    const newPost = await Post.create({
      user: req.user._id,
      message: req.body.message,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    const post = await Post.findById(newPost._id)
      .populate("user", "name email")
      .populate("comments.user", "name");

    res.json({ message: "Posted ✅", post });
  } catch (err) {
    res.status(500).json({ message: "Error while posting", error: err.message });
  }
});

// Get All Posts (Feed)
router.get("/feed", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Like / Unlike
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;

    post.likes.includes(userId)
      ? post.likes.pull(userId)
      : post.likes.push(userId);

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "name email")
      .populate("comments.user", "name")
      .populate("likes", "name");

    res.json({ message: "Like Updated ✅", post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: "Error while liking post", error: err.message });
  }
});

// Add Comment
router.post("/comment/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user._id, text: req.body.text });
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "name")
      .populate("comments.user", "name");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
});

// Edit Post
router.put("/edit/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.message = req.body.message || post.message;
    await post.save();

    const updated = await Post.findById(post._id).populate("user", "name email");
    res.json({ message: "Post Updated ✅", post: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating post", error: err.message });
  }
});

// Delete Post
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const deleted = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    res.json({ success: true, message: "Post Deleted ✅", deletedId: req.params.id });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Profile Page (User Info + Posts)
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email");
    const posts = await Post.find({ user: req.params.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

module.exports = router;
