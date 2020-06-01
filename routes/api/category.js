const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');

// hanle GET request at /api/category to get all the categories
router.get('/', categoryController.categoryIndex);

//handle POST reqest at /api/category/create to create a new category
router.post('/create', categoryController.createCategory);

// handle GET request at /api/category/:id to get one category
router.get('/:id', categoryController.categoryDetails);

// handle DELETE request at /api/category/:id/delete to delete a category with id
router.delete('/:id/delete', categoryController.deleteCategory);

//handle PUT request at /api/category/:id/update to update a category with id
router.put('/:id/update', categoryController.updateCategory);

module.exports = router;