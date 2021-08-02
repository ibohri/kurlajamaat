const express = require("express");
const router = express.Router();
const userRepo = require("../repository/user.repository");

// get
router.get("/", async (req, res, next) => {
  try {
    const users = await userRepo.queryUsers();
    res.json({
      isSuccess: true,
      users,
    });
  } catch (ex) {
    next(ex);
  }
});

// get current user
router.get("/current", async (req, res, next) => {
  try {
    const user = await userRepo.findOne({ _id: req.user._id });
    res.json({
      isSuccess: true,
      user,
    });
  } catch (ex) {
    next(ex);
  }
});

// get by id
router.get("/:id", async (req, res, next) => {
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
});

// create
router.post("/", async (req, res, next) => {
  try {
    const { _id, username, name, password, role, relayFrom } = req.body;
    const user = await userRepo.createUser({
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
});

// edit
router.put("/", async (req, res, next) => {
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
});

// delete
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await userRepo.deleteUser(id);
    res.json({
      isSuccess: true,
    });
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
