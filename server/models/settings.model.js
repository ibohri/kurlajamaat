const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  youtubeChannelId: {
    type: String,
  },
  siteName: {
    type: String,
    default: "Anjuman-E-Zainee Kurla",
  },
  contacts: {
    type: [contactSchema],
    default: [],
  },
  logo: {
    type: String,
  },
  favicon: {
    type: String,
  },
});

module.exports.Settings = mongoose.model("Settings", settingsSchema);
