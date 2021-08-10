const { Settings } = require("../models/settings.model");
let savedSettings;
// create
module.exports.updateSettings = async ({
  videoURL,
  daarulImaratVideoURL,
  audioURL,
  youtubeChannelId,
}) => {
  savedSettings = null;
  await Settings.findOneAndUpdate(
    {},
    { videoURL, daarulImaratVideoURL, audioURL, youtubeChannelId },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// get
module.exports.getSettings = async () => {
  if (!savedSettings) {
    savedSettings = await Settings.findOne({});
  }
  return savedSettings;
};
