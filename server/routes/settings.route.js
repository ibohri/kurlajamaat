const express = require("express");
const router = express.Router();
const settingsRepo = require("../repository/settings.repository");

// update settings
router.post("/", async (req, res, next) => {
  try {
    const { videoURL, audioURL, youtubeChannelId } = req.body;
    await settingsRepo.updateSettings({
      videoURL,
      audioURL,
      youtubeChannelId,
    });
    res.json({
      isSuccess: true,
    });
  } catch (ex) {
    next(ex);
  }
});

// get settings
router.get("/", async (req, res, next) => {
  try {
    const settings = await settingsRepo.getSettings();
    res.json({
      isSuccess: true,
      settings,
    });
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
