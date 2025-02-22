const controllerWrapper = (controller) => {
  return async function (req, res, next) {
    try {
      await controller(req, res);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = controllerWrapper;
