const { Settings } = require("../models/settings.model");

// create
module.exports.updateSettings = async ({ videoURL, daarulImaratVideoURL }) => {
  await Settings.findOneAndUpdate(
    {},
    { videoURL, daarulImaratVideoURL },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// get
module.exports.getSettings = async () => {
  return await Settings.findOne({});
};
