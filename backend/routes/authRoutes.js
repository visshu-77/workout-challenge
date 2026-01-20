const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const upload = require("../config/multer");
const sendWelcomeEmail = require("../utils/sendWelcomeEmail");

const crypto = require("crypto");


const router = express.Router();

// REGISTER
// router.post(
//   "/register",
//   upload.single("profileImage"),
//   async (req, res) => {
//     try {
//       const { name, email, password, mobile, workoutTime } = req.body;

//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const user = await User.create({
//         name,
//         email,
//         mobile,
//         workoutTime,
//         password: hashedPassword,
//         profileImage: req.file ? req.file.filename : null,
//       });

//       // 📧 Send welcome email
//       await sendWelcomeEmail(email, name);

//       res.json({ message: "User registered successfully" });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Registration failed" });
//     }
//   }
// );


router.post(
  "/register",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { name, email, password, mobile, workoutTime } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        mobile,
        workoutTime,
        password: hashedPassword,
        profileImage: req.file ? req.file.filename : null,
      });

      // Email should NOT break registration
      try {
        await sendWelcomeEmail(email, name);
      } catch (emailError) {
        console.error("Welcome email failed:", emailError.message);
      }

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  }
);



// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        workouts: user.workouts
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});



router.post("/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ message: "If email exists, link sent" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${token}`;

  await sendWelcomeEmail(
    user.email,
    user.name,
    resetLink,
    true
  );

  res.json({ message: "Reset link sent" });
});


router.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  res.json({ message: "Password updated" });
});


module.exports = router;
