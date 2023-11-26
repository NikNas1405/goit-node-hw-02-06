const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("node:fs/promises");
const path = require("node:path");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const { HttpError } = require("../utils/HttpError");

const User = require("../models/user.model");

async function registerServices(body) {
  const { email, password, subscription } = body;

  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mp" });

  const passwordHash = await bcrypt.hash(password, 10);

  return await User.create({
    email,
    password: passwordHash,
    subscription,
    avatarURL,
  });
}

async function loginServices(body) {
  const { email, password } = body;

  const user = await User.findOne({ email }).exec();

  if (!user || user === null) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch || isMatch === false) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const currentUser = await User.findByIdAndUpdate(user._id, { token }).exec();

  if (!currentUser) {
    throw new HttpError(500, "Failed to update token");
  }

  return { currentUser, token };
}

async function logoutServices(id) {
  const currentUser = await User.findByIdAndUpdate(id, { token: null });
  return currentUser;
}

async function getCurrentServices(user) {
  const currentUser = {
    email: user.email,
    subscription: user.subscription,
  };

  return currentUser;
}

async function uploadAvatarServices(user, file) {
  const { path: tempPath, filename } = file;
  const { id } = user;

  await Jimp.read(tempPath)
    .then((image) => image.resize(250, 250).writeAsync(tempPath))
    .catch(() => {
      throw new HttpError(400, "Invalid image format");
    });

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      avatarURL: `avatars/${filename}`,
    },
    { new: true }
  ).exec();

  if (!updatedUser || updatedUser === null) {
    throw new HttpError(401, "Not authorized");
  }

  await fs.rename(
    tempPath,
    path.join(__dirname, "..", "public/avatars", filename)
  );

  return updatedUser;
}

module.exports = {
  registerServices,
  loginServices,
  logoutServices,
  getCurrentServices,
  uploadAvatarServices,
};
