const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { sendMessage } = require("../config/websocket.config");
const userRepo = require("../repository/user.repository");

router.post("/logout", async (req, res, next) => {
  try {
    await req.logout();
    res.clearCookie("jwt", { path: "/", httpOnly: true });
    res.clearCookie("jwt.sig", { path: "/", httpOnly: true });
    return res.redirect("/");
  } catch (ex) {
    next(ex);
  }
});

router.post("/login", passport.authenticate("local"), async (req, res) => {
  // update session id
  await userRepo.updateOne({ _id: req.user._id }, { sessionId: req.sessionID });
  jwt.sign({ user: req.user }, process.env.SECRET, (err, token) => {
    if (err) return res.json(err);

    // Send Set-Cookie header
    res.cookie("jwt", token, {
      sameSite: true,
      signed: true,
      secure: true,
    });

    // Return json web token
    return res.json({
      jwt: token,
      user: req.user,
      isSuccess: true,
    });
  });
});

module.exports = router;
