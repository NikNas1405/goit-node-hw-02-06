const controllerWrapper = require("../utils/controllerWrapper");
const {
  registerServices,
  loginServices,
  logoutServices,
  getCurrentServices,
  uploadAvatarServices,
} = require("../services/users.services");

const register = controllerWrapper(async (req, res, next) => {
  const user = await registerServices(req.body);
  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
});

const login = controllerWrapper(async (req, res, next) => {
  const { currentUser, token } = await loginServices(req.body);

  res.status(200).json({
    token,
    user: {
      email: currentUser.email,
      subscription: currentUser.subscription,
    },
  });
});

const logout = async (req, res, next) => {
  const { id } = req.user;
  await logoutServices(id, { token: null });
  res.status(204).end();
};

const getCurrent = controllerWrapper(async (req, res, next) => {
  const user = await getCurrentServices(req.user);
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
});

const uploadAvatar = controllerWrapper(async (req, res, next) => {
  const updatedUser = await uploadAvatarServices(req.user, req.file);
  res.status(200).json({
    avatarURL: updatedUser.avatarURL,
  });
});

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  uploadAvatar,
};
