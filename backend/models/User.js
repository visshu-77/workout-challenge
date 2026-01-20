const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  day: Number,
  image: String,
  date: Date,
  resetToken: String,
  resetTokenExpiry: Date,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  mobile: { type: String, required: true },

  email: { type: String, unique: true, required: true },

  password: { type: String, required: true },

  profileImage: { type: String },

  workoutTime: { type: String }, // e.g. "Morning 6 AM"

  streak: { type: Number, default: 0 },

  lastUploadDate: Date,

  workouts: [workoutSchema],

  height: { type: Number }, // cm
  weight: { type: Number }, // kg
  age: { type: Number },
  gender: { type: String }, // optional

});

module.exports = mongoose.model("User", userSchema);
