const express = require("express");

const AuthController = require("../../controllers/users.controllers");
const { validateBody } = require("../../utils/validateBody");
const { userValidationSchema } = require("../../utils/validation");
const router = express.Router();

const jsonParser = express.json();

const userMiddleware = require("../../middlewares/user.middleware");

router.post(
  "/register",
  jsonParser,
  validateBody(userValidationSchema),
  AuthController.register
);

router.post(
  "/login",
  jsonParser,
  validateBody(userValidationSchema),
  AuthController.login
);

router.post("/logout", userMiddleware, AuthController.logout);

router.get("/current", userMiddleware, AuthController.getCurrent);



module.exports = { authRouter: router };
