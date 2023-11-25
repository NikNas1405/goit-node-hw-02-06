const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const { HttpError } = require("../utils/HttpError");

const userMiddleware = async (req, res, next) => {
  // const userAuthHeader = req.headers["authorization"];
  const userAuthHeader = req.headers.authorization;

  if (typeof userAuthHeader === "undefined") {
    return next(new HttpError(401, "Not authorized"));
  }

  const [bearer, token] = userAuthHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    return next(new HttpError(401, "Not authorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    try {
      req.user = decode;
      const user = await User.findById(decode.id).exec();
      if (!user || !user.token || user.token !== token) {
        return res.status(401).json({
          message: "Not authorized",
        });
      }

      req.user = { id: user._id };

      next();
    } catch (error) {
      next(error);
    }
  });
};

module.exports = userMiddleware;
