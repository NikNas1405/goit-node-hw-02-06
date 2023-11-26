const multer = require("multer");
const path = require("path");
const crypto = require("node:crypto");

const tmpDir = path.join(__dirname, "..", "tmp");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  // destination: tmpDir,
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname); // виведе розширення
    const basename = path.basename(file.originalname, extname); // виведе назву без розширення
    const suffix = crypto.randomUUID();

    cb(null, `${basename}-${suffix}${extname}`);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
