const express = require("express");
const router = express.Router();
const category_controller = require("../../controllers/categoryController");
const category_validation = require("../../middlewares/validation/validateCategory");
const { auth, adminAuth, sellerAuth } = require("../../middlewares/auth");

// @route   GET /api/category
// @desc    Get all categories
// @access  public
router.get("/", category_controller.categoryIndex);

// @route   POST /api/category/create
// @desc    create a new category
// @access  private
router.post(
  "/create",
  auth,
  sellerAuth,
  category_validation.validateAdd,
  category_controller.createCategory
);

// @route   GET /api/category/:id
// @desc    get one category details
// @access  public
router.get("/:id", category_controller.categoryDetails);

// @route   DELETE /api/category/:id/delete
// @desc    delete a category with specific id
// @access  private
router.delete("/:id/delete", auth, adminAuth, category_controller.deleteCategory);

// @route   PUT /api/category/:id/update
// @desc    update a category with specific id
// @access  private
router.put(
  "/:id/update",
  auth,
  adminAuth,
  category_validation.validateUpdate,
  category_controller.updateCategory
);

module.exports = router;
