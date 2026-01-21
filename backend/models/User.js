const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  day: Number,
  image: String,
  public_id: String,
  date: Date,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  mobile: { type: String, required: true },

  email: { type: String, unique: true, required: true },

  password: { type: String, required: true },

  profileImage: { type: String },

  workoutTime: { type: String }, 

  streak: { type: Number, default: 0 },

  lastUploadDate: Date,

  workouts: [workoutSchema],
});

module.exports = mongoose.model("User", userSchema);
