let async = require("async");
const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");

// hanle GET request at /api/category to get all the categories
exports.categoryIndex = (req, res) => {
  Category.find()
    .sort({ name: 1 })
    .then(category => res.json(category));
};

//handle POST reqest at /api/category/create to create a new category
exports.createCategory = (req, res) => {
  // Create a newCategory object with escaped and trimmed data if it's valid
  let newCategory = new Category({
    name: req.body.name,
    description: req.body.description
  });

  // Check if Category with same name already exists.
  Category.findOne({
    name: req.body.name
  }).exec(function (err, found_category) {
    if (found_category) {
      // Category exists, redirect to its page
      res.status(400).json({
        message: "Category already exists"
      });
    } else if (err) {
      res.json({
        message: "Couldn't create please try again"
      });
    } else {
      newCategory.save(function (err) {
        if (err) {
          res.json({
            message: "Couldn't create please try again"
          });
        } else {
          res.json({
            message: "Created Successfully"
          });
        }
      });
    }
  });
};

// handle GET request at /api/category/:id to get one category items
exports.categoryDetails = function (req, res) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      products: function (callback) {
        Product.find({
          category: req.params.id
        }).exec(callback);
      }
    },
    function (err, results) {
      if (err) {
        return res.status(404).json({ message: "Couldn't load category", err });
      } else {
        let categoryProducts = results.products;
        let category = results.category;

        // get only products in stock
        let products = categoryProducts.filter(item => item.numberInStock !== 0);

        return res.status(200).json({ products, category });
      }
    }
  );
};

// handle DELETE request at /api/category/:id/delete
exports.deleteCategory = (req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then(() => {
      return res.status(200).json({
        message: `Category was deleted Succefully`
      });
    })
    .catch(error => {
      return res
        .status(400)
        .json({ error, message: "Couldn't delete, please try again" });
    });
};

//handle POST request at /api/category/:id/update to update a category with id
exports.updateCategory = (req, res) => {
  // create clear updatedCategory after sanitization
  let updatedCategory = new Category({
    name: req.body.name,
    description: req.body.description,
    _id: req.params.id
  });

  Category.findByIdAndUpdate(req.params.id, updatedCategory, {
    new: true,
    useFindAndModify: false
  })
    .then(category => res.json({ message: "Successfully updated", category }))
    .catch(err => res.json(err));
};
