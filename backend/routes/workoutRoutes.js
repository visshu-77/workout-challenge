const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Use memory multer + streamifier + cloudinary for serverless-friendly uploads
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const router = express.Router();
const memoryStorage = multer.memoryStorage();
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const upload = multer({ storage: memoryStorage, limits: { fileSize: MAX_FILE_SIZE } });

// UPLOAD WORKOUT IMAGE
router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let newStreak = 1;

      if (user.lastUploadDate) {
        const lastDate = new Date(user.lastUploadDate);
        lastDate.setHours(0, 0, 0, 0);

        const diffDays =
          (today - lastDate) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          newStreak = user.streak + 1;
        } else if (diffDays === 0) {
          return res.json({ message: "Already uploaded today" });
        } else {
          newStreak = 1;
        }
      }

      // If a file was provided, upload to Cloudinary from memory buffer
      let imageUrl = null;
      let publicId = null;
      if (req.file && req.file.buffer) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "daily_workout_images" },
              (error, result) => (error ? reject(error) : resolve(result))
            );
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
          });
          imageUrl = uploadResult.secure_url;
          publicId = uploadResult.public_id;
        } catch (uploadErr) {
          console.error("Cloudinary upload failed:", uploadErr);
          return res.status(500).json({ message: "Image upload failed" });
        }
      } else {
        return res.status(400).json({ message: "No image provided" });
      }

      user.streak = newStreak;
      user.lastUploadDate = today;
      user.workouts.push({
        day: newStreak,
        image: imageUrl,
        public_id: publicId,
        date: new Date()
      });

      await user.save();

      res.json({
        message: "Workout uploaded",
        streak: user.streak,
        workouts: user.workouts
      });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

// GET USER PROFILE
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

// DELETE WORKOUT
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const workoutToDelete = user.workouts.find(
      (w) => w._id.toString() === req.params.id
    );

    if (workoutToDelete && workoutToDelete.public_id) {
      // attempt to delete from Cloudinary (best-effort)
      try {
        await cloudinary.uploader.destroy(workoutToDelete.public_id);
      } catch (destroyErr) {
        console.error("Failed to delete image from Cloudinary:", destroyErr);
      }
    }

    user.workouts = user.workouts.filter(
      (w) => w._id.toString() !== req.params.id
    );

    // Recalculate streak
    user.streak = user.workouts.length;
    user.lastUploadDate =
      user.workouts.length > 0
        ? user.workouts[user.workouts.length - 1].date
        : null;

    await user.save();

    res.json({ message: "Workout deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

// EDIT WORKOUT IMAGE
router.put(
  "/edit/:id",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);

      const workout = user.workouts.find(
        (w) => w._id.toString() === req.params.id
      );

      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }

      // upload new image to Cloudinary
      if (req.file && req.file.buffer) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "daily_workout_images" },
              (error, result) => (error ? reject(error) : resolve(result))
            );
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
          });

          // optionally delete previous image
          if (workout.public_id) {
            try {
              await cloudinary.uploader.destroy(workout.public_id);
            } catch (e) {
              console.error("Failed to delete previous image:", e);
            }
          }

          workout.image = uploadResult.secure_url;
          workout.public_id = uploadResult.public_id;
          await user.save();
          return res.json({ message: "Workout updated" });
        } catch (uploadErr) {
          console.error("Cloudinary upload failed:", uploadErr);
          return res.status(500).json({ message: "Image upload failed" });
        }
      } else {
        return res.status(400).json({ message: "No image provided" });
      }
    } catch {
      res.status(500).json({ message: "Update failed" });
    }
  }
);

// GET TOP STREAKS - returns users sorted by highest streak
// optional query: ?limit=5
router.get("/top-streaks", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const users = await User.find()
      .sort({ streak: -1 })
      .limit(limit)
      .select("-password");

    res.json(users);
  } catch (error) {
    console.error("TOP STREAKS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch top streaks" });
  }
});

module.exports = router;


