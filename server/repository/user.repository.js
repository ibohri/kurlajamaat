const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");

// create
module.exports.createUser = async ({
  _id,
  username,
  password,
  name,
  role,
  relayFrom,
}) => {
  const passwordHash = await this.getPasswordHash(password);
  if (_id) {
    return await User.findOneAndUpdate(
      { _id },
      {
        username,
        password: passwordHash,
        name,
        role,
        relayFrom,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } else {
    return await User.create({
      username,
      password: passwordHash,
      name,
      relayFrom,
      role,
    });
  }
};

// get all
module.exports.queryUsers = async (query, includeDeleted) => {
  return await User.find({
    ...(query || {}),
    isDeleted: !!includeDeleted,
  });
};

// find one
module.exports.findOne = async (query, includeDeleted) => {
  return await User.findOne({
    ...(query || {}),
    isDeleted: !!includeDeleted,
  });
};

// update
module.exports.updateUser = async ({ username, password, name, role }) => {
  const passwordHash = await this.getPasswordHash(password);
  return await User.findOneAndUpdate(
    { username },
    {
      username,
      password: passwordHash,
      name,
      role,
    }
  );
};

// updateOne
module.exports.updateOne = async (query, updateData) => {
  await User.findOneAndUpdate(query, updateData);
};

// delete
module.exports.deleteUser = async (id) => {
  await User.deleteOne({ _id: id });
};

// hash password
module.exports.getPasswordHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
