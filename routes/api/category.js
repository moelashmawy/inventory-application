const express = require("express");
const router = express.Router();
const category_controller = require("../../controllers/categoryController");

// hanle GET request at /api/category to get all the categories
router.get("/", category_controller.categoryIndex);

//handle POST reqest at /api/category/create to create a new category
router.post("/create", category_controller.createCategory);

// handle GET request at /api/category/:id to get one category
router.get("/:id", category_controller.categoryDetails);

// handle DELETE request at /api/category/:id/delete to delete a category with id
router.delete("/:id/delete", category_controller.deleteCategory);

//handle PUT request at /api/category/:id/update to update a category with id
router.put("/:id/update", category_controller.updateCategory);

module.exports = router;
