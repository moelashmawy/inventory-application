const express = require("express");
const router = express.Router();
const product_controller = require("../../controllers/productController");
const product_validation = require("../../middlewares/validation/validateProduct");
const handle_images = require("../../middlewares/handleImageMulter");
const { auth, sellerAuth } = require("../../middlewares/auth");

// @route   GET /api/product
// @desc    Get all products
// @access  public
router.get("/", product_controller.allProducts);

// @route   GET /api/product/:userId/products
// @desc    Get a specific user products
// @access  public
router.get("/my_products", auth, product_controller.userProducts);

// @route   POST /api/product/create
// @desc    Create a new product
// @access  private
router.post(
  "/create",
  auth,
  sellerAuth,
  handle_images.productImages(),
  product_validation.validateAdd,
  product_controller.createProduct
);

// @route   GET /api/product/:id
// @desc    Get one product details
// @access  public
router.get("/:id", product_controller.productDetails);

// @route   DELETE /api/product/:id/delete
// @desc    Delete one product
// @access  private
router.delete("/:id/delete", auth, sellerAuth, product_controller.deleteProduct);

// @route   POST /api/product/:id/update
// @desc    Update one product
// @access  private
router.post(
  "/:id/update",
  auth,
  sellerAuth,
  handle_images.productImages(),
  product_validation.validateUpdate,
  product_controller.updateProduct
);

module.exports = router;
