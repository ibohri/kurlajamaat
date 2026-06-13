const { Settings } = require("../models/settings.model");
let savedSettings;

module.exports.updateSettings = async ({
  youtubeChannelId,
  siteName,
  contacts,
  logo,
  favicon,
}) => {
  savedSettings = null;
  await Settings.findOneAndUpdate(
    {},
    { youtubeChannelId, siteName, contacts, logo, favicon },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

module.exports.getSettings = async () => {
  if (!savedSettings) {
    savedSettings = await Settings.findOne({});
  }
  return savedSettings;
};
