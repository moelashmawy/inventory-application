const express = require("express");
const router = express.Router();
const product_controller = require("../../controllers/productController");
const auth = require("../../middlewares/auth");

// @route   GET /api/product
// @desc    Get all products
// @access  public
router.get("/", product_controller.productIndex);

// @route   POST /api/product/create
// @desc    Create a new product
// @access  private
router.post(
  "/create",
  auth,
  product_controller.handleImages("productImage"),
  product_controller.createProduct
);

// @route   GET /api/product/:id
// @desc    Get one product details
// @access  public
router.get("/:id", product_controller.productDetails);

// @route   DELETE /api/product/:id/delete
// @desc    Delete one product
// @access  private
router.delete("/:id/delete", auth, product_controller.deleteProduct);

// @route   POST /api/product/:id/update
// @desc    Update one product
// @access  private
router.post(
  "/:id/update",
  auth,
  product_controller.handleImages("productImage"),
  product_controller.updateProduct
);

module.exports = router;
