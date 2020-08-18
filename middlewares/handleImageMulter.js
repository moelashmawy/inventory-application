const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "hamohuh",
  api_key: "838736889631699",
  api_secret: "4V8gR-toRb1FCVmfmD5nM-mGL5M"
});

var storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "E-commerce",
    allowed_formats: ["jpg", "png", "jpeg", "gif"] // supports promises as well
  }
});

exports.productImages = function () {
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: fileFilter });

  return upload.array("productImage", 12);
};

// in case for images local storing
/* // Multer handling image upload Middleware at /api/product/create
exports.productImages = function () {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + "-" + Date.now() + ".jpg");
    }
  });

  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  upload = multer({ storage: storage, fileFilter: fileFilter });

  return upload.array("productImage", 12);
};
 */
