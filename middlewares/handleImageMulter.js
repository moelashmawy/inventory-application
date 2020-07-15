const multer = require("multer");

// Multer handling image upload Middleware at /api/product/create
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
