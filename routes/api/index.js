const express = require("express");

const router = express.Router();

const  userMiddleware  = require("../../middlewares/user.middleware");

const { authRouter } = require("./users");
const { contactsRouter } = require("./contacts");

router.use("/users", authRouter);
router.use("/contacts", userMiddleware, contactsRouter);

module.exports = router;
