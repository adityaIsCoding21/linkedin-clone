const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Signup successful ✅" });
  } catch (err) {
    res.json({ message: "Error in signup", error: err });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // console.log("Login attempt:", email); 

    const user = await User.findOne({ email });
    // console.log("User found:", user); 

    if (!user) return res.json({ message: "User not found..." });

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log("Password match:", isMatch); 

    if (!isMatch) return res.json({ message: "Incorrect password..." });

    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET
    );

    return res.json({
      message: "Login successful...",
      token,
      name: user.name
    });

  } catch (err) {
    // console.log("Login error:", err);
    return res.json({ message: "Login error...", error: err.message });
  }
});

module.exports = router;
