const express = require("express");
const router = express.Router();
const userRepo = require("../repository/user.repository");
const passport = require("passport");
const sessionRepo = require("../repository/session.repository");
// get
router.get(
  "/",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const users = await userRepo.queryUsers();
      res.json({
        isSuccess: true,
        users,
      });
    } catch (ex) {
      next(ex);
    }
  }
);

// get current user
router.get("/current", async (req, res, next) => {
  try {
    if (
      req.user &&
      req.user._id &&
      sessionRepo.getSession(req.user._id) === req.sessionID
    ) {
      const user = await userRepo.findOne({
        _id: req.user._id,
      });
      res.json({
        isSuccess: true,
        user,
      });
      return;
    }
    res.json({
      isSuccess: false,
    });
  } catch (ex) {
    next(ex);
  }
});

// get by id
router.get(
  "/:id",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userRepo.findOne({ _id: id });
      res.json({
        isSuccess: true,
        user,
      });
    } catch (ex) {
      next(ex);
    }
  }
);

// create
router.post(
  "/",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const { _id, username, name, password, role, relayFrom } = req.body;
      let user = await userRepo.findOne({ username });
      if (user && !_id) {
        res.json({
          isSuccess: false,
          errors: ["User already exists"],
        });
        return;
      }
      user = await userRepo.createUser({
        _id,
        username,
        name,
        password,
        role,
        relayFrom,
      });
      res.json({
        isSuccess: true,
        user,
      });
    } catch (ex) {
      next(ex);
    }
  }
);

// edit
router.put(
  "/",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const { username, name, password, role } = req.body;
      const user = await userRepo.updateUser({
        username,
        name,
        password,
        role,
      });
      res.json({
        isSuccess: true,
        user,
      });
    } catch (ex) {
      next(ex);
    }
  }
);

// delete
router.delete(
  "/:id",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await userRepo.deleteUser(id);
      res.json({
        isSuccess: true,
      });
    } catch (ex) {
      next(ex);
    }
  }
);

router.post(
  "/changePassword",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const hash = await userRepo.getPasswordHash(req.body.password);
      await userRepo.updateOne(
        {
          _id: req.user._id,
        },
        {
          password: hash,
          mustChangePassword: false,
        }
      );
      res.json({
        isSuccess: true,
      });
    } catch (ex) {
      next(ex);
    }
  }
);

module.exports = router;
