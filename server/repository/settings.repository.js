const { Settings } = require("../models/settings.model");
let savedSettings;
// create
module.exports.updateSettings = async ({
  videoURL,
  daarulImaratVideoURL,
  audioURL,
}) => {
  savedSettings = null;
  await Settings.findOneAndUpdate(
    {},
    { videoURL, daarulImaratVideoURL, audioURL },
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
