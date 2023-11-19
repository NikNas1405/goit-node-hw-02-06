require("dotenv").config();
require("./server.js");

const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const routes = require("./routes/api");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    message: "This route does not exist, please check the documentation",
  });
});

app.use((err, req, res, next) => {
  const {
    message = "Something went wrong. Please try again later",
    statusCode = 500,
  } = err;
  res.status(statusCode).json({ message });
});

module.exports = app;
