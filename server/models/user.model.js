const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  sessionId: {
    type: String,
  },
  mustChangePassword: {
    type: Boolean,
    default: true,
  },
  loggedInTime: {
    type: Date,
  },
  isEnabled: {
    type: Boolean,
    default: false,
  },
  audioOnly: {
    type: Boolean,
    default: false,
  },
});

userSchema.index({
  username: 1,
});

module.exports.User = new mongoose.model("User", userSchema);
