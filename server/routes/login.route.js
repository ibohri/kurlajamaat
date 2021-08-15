const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const sessionRepo = require("../repository/session.repository");
const userRepo = require("../repository/user.repository");
const { emitMessage } = require("../socket");

router.get("/logout", async (req, res, next) => {
  try {
    await req.logout();
    res.clearCookie("jwt", { path: "/", httpOnly: true });
    res.clearCookie("jwt.sig", { path: "/", httpOnly: true });
    res.sendStatus(200);
  } catch (ex) {
    next(ex);
  }
});

router.post("/login", passport.authenticate("local"), async (req, res) => {
  // update session id
  emitMessage(req.user.id, {
    type: "LOGOUT",
  });
  sessionRepo.saveSession(req.user.id, req.sessionID);
  await userRepo.updateOne(
    { _id: req.user.id },
    {
      loggedInTime: Date.now(),
    }
  );
  const user = req.user;
  jwt.sign({ user }, process.env.SECRET, (err, token) => {
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
      user,
      isSuccess: true,
    });
  });
});

module.exports = router;
