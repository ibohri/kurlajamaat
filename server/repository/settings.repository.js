const { Settings } = require("../models/settings.model");

// create
module.exports.updateSettings = async ({ videoURL }) => {
  await Settings.findOneAndUpdate(
    {},
    { videoURL },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// get
module.exports.getSettings = async () => {
  return await Settings.findOne({});
};
