const express = require("express");
const router = express.Router();
const userRepo = require("../repository/user.repository");
const passport = require("passport");
const bcrypt = require("bcrypt");
const sessionRepo = require("../repository/session.repository");
const { emitMessage } = require("../socket");

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

router.get(
  "/logged-in-users",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const userIds = Object.keys(sessionRepo.getAll());
      const users = await userRepo.queryUsers({ _id: { $in: userIds } });
      res.json({
        isSuccess: true,
        users,
      });
    } catch (err) {
      next(err);
    }
  }
);

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

router.post("/upload", async (req, res, next) => {
  try {
    const users = req.body;
    for (let user of users) {
      let savedUser = await userRepo.findOne({ username: user.username });
      if (!savedUser) {
        savedUser = await userRepo.createUser({
          username: `${user.username}`,
          name: `${user.name}`,
          password: `${user.password}`,
          role: user.role || "User",
          isEnabled: true,
        });
      } else {
        savedUser = await userRepo.updateOne(
          { username: user.username },
          {
            name: user.name,
            role: user.role || "User",
            isEnabled: true,
          }
        );
      }
    }
    res.json({
      isSuccess: true,
    });
  } catch (ex) {
    next(ex);
  }
});

router.delete("/delete-all", async (req, res, next) => {
  try {
    await userRepo.deleteAllNonAdminUsers();
    res.json({
      isSuccess: true,
    });
  } catch (ex) {
    next(ex);
  }
});

// create
router.post(
  "/",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const { _id, username, name, password, role, isEnabled, audioOnly } =
        req.body;
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
        isEnabled,
        audioOnly,
      });
      emitMessage(_id, {
        type: "RESET_USER",
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
      const { username, name, password, role, isEnabled, audioOnly } = req.body;
      const user = await userRepo.updateUser({
        username,
        name,
        password,
        role,
        isEnabled,
        audioOnly,
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

router.post(
  "/enable-disable-user",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const { isEnabled, _id } = req.body;
      emitMessage(_id, {
        type: "LOGOUT",
      });
      const user = await userRepo.updateOne(
        { _id },
        {
          isEnabled,
        }
      );
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
      const user = await userRepo.findOne({ _id: req.user._id });
      //   const salt = await bcrypt.genSalt(10);
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!isMatch) {
        res.json({
          isSuccess: false,
          errors: ["Password is invalid"],
        });
        return;
      }
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

router.post("/updateUsers", async (req, res) => {
  try {
    const users = req.body.Sheet1;

    for (let user of users) {
      const savedUser = await userRepo.findOne({ username: user.ITS_ID });
      if (!savedUser) {
        await userRepo.createUser({
          username: user.ITS_ID,
          name: user.Full_Name,
          password: user.ITS_ID,
          role: "User",
        });
      } else {
        await userRepo.updateOne(
          { username: user.ITS_ID },
          {
            name: user.Full_Name,
          }
        );
      }
    }
    res.json({
      isSucess: true,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
