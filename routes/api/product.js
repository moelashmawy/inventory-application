const express = require("express");
const router = express.Router();
const product_controller = require("../../controllers/productController");
var multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
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

//const upload = multer({ storage /* , fileFilter */ });
const upload = multer({ storage: storage, fileFilter: fileFilter });

// GET request at /api/product for list of all products
router.get("/", product_controller.productIndex);

// POST request at /api/product/create to create a new product
router.post(
    "/create",
    product_controller.handleImages("productImage"),
    product_controller.createProduct
);

// GET request at /api/product/:id to get one product details
router.get("/:id", product_controller.productDetails);

// DELETE request at /api/product/:id/delete to delete one product
router.delete("/:id/delete", product_controller.deleteProduct);

// POST request at /api/product/:id/update to update one product
router.post(
    "/:id/update",
    product_controller.handleImages("productImage"),
    product_controller.updateProduct
);

module.exports = router;
