const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  videoURL: {
    type: String,
    required: true,
  },
  audioURL: {
    type: String,
  },
  youtubeChannelId: {
    type: String,
  },
});

module.exports.Settings = mongoose.model("Settings", settingsSchema);
