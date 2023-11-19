const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { HttpError } = require("../utils/HttpError");

const User = require("../models/user.model");

async function registerServices(body) {
  const { email, password, subscription } = body;

  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, "Email in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return await User.create({ email, password: passwordHash, subscription });
}

async function loginServices(body) {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  const currentUser = await User.findByIdAndUpdate(user._id, { token });
  return currentUser;
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

module.exports = {
  registerServices,
  loginServices,
  logoutServices,
  getCurrentServices,
};
