const express = require("express");
const router = express.Router();
const settingsRepo = require("../repository/settings.repository");

router.post("/", async (req, res, next) => {
  try {
    const { youtubeChannelId, siteName, contacts, logo, favicon } = req.body;
    await settingsRepo.updateSettings({ youtubeChannelId, siteName, contacts, logo, favicon });
    res.json({ isSuccess: true });
  } catch (ex) {
    next(ex);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const settings = await settingsRepo.getSettings();
    res.json({ isSuccess: true, settings });
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
