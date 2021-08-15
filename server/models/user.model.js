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
  relayFrom: {
    type: String,
    required: true,
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
});

userSchema.index({
  username: 1,
});

module.exports.User = new mongoose.model("User", userSchema);
