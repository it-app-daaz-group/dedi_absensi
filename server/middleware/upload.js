const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../uploads/attendance/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});

const uploadFile = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB limit

module.exports = uploadFile;
