const controllerWrapper = require("../utils/controllerWrapper");
const {
  registerServices,
  loginServices,
  logoutServices,
  getCurrentServices,
} = require("../services/users.services");

const register = controllerWrapper(async (req, res, next) => {
  const user = await registerServices(req.body);
  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

const login = controllerWrapper(async (req, res, next) => {
  const currentUser = await loginServices(req.body);

  console.log(currentUser);

  res.status(200).json({
    token: currentUser.token,
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
  console.log(user);
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
});

module.exports = {
  register,
  login,
  logout,
  getCurrent,
};
