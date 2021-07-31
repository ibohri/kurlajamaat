const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  videoURL: {
    type: String,
    required: true,
  },
});

module.exports.Settings = new mongoose.model("Settings", settingsSchema);
