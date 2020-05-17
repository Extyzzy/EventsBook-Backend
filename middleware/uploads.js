const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${moment().unix()}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadImages = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const upload = multer();

module.exports = {
  uploadImages,
  upload
};