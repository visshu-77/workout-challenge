const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }
});

// Limit file size to 2 MB
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } });

module.exports = upload;