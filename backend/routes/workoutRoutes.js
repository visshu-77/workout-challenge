const express = require("express");
const User = require("../models/User");
const upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

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

      user.streak = newStreak;
      user.lastUploadDate = today;
      user.workouts.push({
        day: newStreak,
        image: req.file.filename,
        date: new Date()
      });

      await user.save();

      res.json({
        message: "Workout uploaded",
        streak: user.streak,
        workouts: user.workouts
      });
    } catch (error) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

// UPDATE PROFILE
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);

      const { name, mobile } = req.body;

      if (name) user.name = name;
      if (mobile) user.mobile = mobile;
      if (req.file) user.profileImage = req.file.filename;

      await user.save();

      res.json({
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({ message: "Profile update failed" });
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
  } catch {
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

      workout.image = req.file.filename;
      await user.save();

      res.json({ message: "Workout updated" });
    } catch {
      res.status(500).json({ message: "Update failed" });
    }
  }
);

// UPDATE PROFILE + FITNESS DATA
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);

      const { name, mobile, height, weight, age, gender } = req.body;

      if (name) user.name = name;
      if (mobile) user.mobile = mobile;
      if (height) user.height = height;
      if (weight) user.weight = weight;
      if (age) user.age = age;
      if (gender) user.gender = gender;

      if (req.file) user.profileImage = req.file.filename;

      await user.save();

      res.json({ message: "Profile updated", user });
    } catch {
      res.status(500).json({ message: "Update failed" });
    }
  }
);


module.exports = router;
