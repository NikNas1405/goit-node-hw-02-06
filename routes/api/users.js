const express = require("express");

const AuthUserController = require("../../controllers/users.controllers");
const { validateBody } = require("../../utils/validateBody");
const { userValidationSchema } = require("../../utils/validation");
const router = express.Router();

const jsonParser = express.json();

const userMiddleware = require("../../middlewares/user.middleware");
const upload = require("../../middlewares/upload.middleware");

router.post(
  "/register",
  jsonParser,
  validateBody(userValidationSchema),
  AuthUserController.register
);

router.post(
  "/login",
  jsonParser,
  validateBody(userValidationSchema),
  AuthUserController.login
);

router.post("/logout", userMiddleware, AuthUserController.logout);

router.get("/current", userMiddleware, AuthUserController.getCurrent);

router.patch(
  "/avatars",
  upload.single("avatarURL"),
  userMiddleware,
  AuthUserController.uploadAvatar
);

module.exports = { authRouter: router };
