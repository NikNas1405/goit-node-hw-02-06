const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("node:fs/promises");
const path = require("node:path");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const crypto = require("node:crypto");

const { HttpError } = require("../utils/HttpError");

const User = require("../models/user.model");
const sendEmail = require("../helpers/sendEmail");

async function registerServices(body) {
  const { email, password, subscription } = body;

  const user = await User.findOne({ email });
  const verificationToken = crypto.randomUUID();

  if (user) {
    throw new HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mp" });

  const passwordHash = await bcrypt.hash(password, 10);

  await sendEmail({
    to: email,
    subject: "Welcome to your contact`s app",
    html: `To confirm your registration, please click here <a href="http://localhost:3000/api/users/verify/${verificationToken}">Click verify email</a>`,
    text: `To confirm your registration, please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
  });

  return await User.create({
    email,
    password: passwordHash,
    subscription,
    avatarURL,
    verificationToken,
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

  if (user.verify !== true) {
    throw new HttpError(404, "User not found");
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

async function verifyUserServices(verificationToken) {
  const user = await User.findOne({ verificationToken }).exec();
  if (user === null || !user) {
    throw new HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  return user;
}

async function resendEmailVerificationService(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(400, "missing required field email");
  }

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  await sendEmail({
    to: email,
    subject: "Welcome to your contact`s app",
    html: `To confirm your registration, please click here <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click verify email</a>`,
    text: `To confirm your registration, please open the link http://localhost:3000/api/users/verify/${user.verificationToken}`,
  });

  return user;
}

module.exports = {
  registerServices,
  loginServices,
  logoutServices,
  getCurrentServices,
  uploadAvatarServices,
  verifyUserServices,
  resendEmailVerificationService,
};
