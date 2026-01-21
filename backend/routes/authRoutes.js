const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// use memory multer + streamifier + cloudinary for uploads
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const sendWelcomeEmail = require("../utils/sendWelcomeEmail");

const router = express.Router();
const memoryStorage = multer.memoryStorage();
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const upload = multer({ storage: memoryStorage, limits: { fileSize: MAX_FILE_SIZE } });

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
      console.log("REGISTER REQ BODY:")
    try {
      const { name, email, password, mobile, workoutTime } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Upload image to Cloudinary if provided
      let profileImageUrl = null;
      if (req.file) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "daily_workout_profile_images" },
              (error, result) => (error ? reject(error) : resolve(result))
            );
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
          });
          profileImageUrl = uploadResult.secure_url;
        } catch (uploadErr) {
          console.error("Cloudinary upload failed:", uploadErr);
        }
      }

      const user = await User.create({
        name,
        email,
        mobile,
        workoutTime,
        password: hashedPassword,
        profileImage: profileImageUrl,
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
    console.log("LOGIN REQ BODY:", req.body);
    

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

module.exports = router;
