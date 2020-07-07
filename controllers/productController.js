const express = require("express");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const Product = require("../models/ProductModel");

// handle GET request at /api/product to get list of all products in stock
exports.productIndex = (req, res, next) => {
  Product.find()
    .sort({ creationDate: -1 })
    .then(allProducts => {
      let productsInStock = allProducts.filter(item => item.numberInStock !== 0);
      res.json({ products: productsInStock });
    });
};

// handle GET request at /api/product/:userId/products to get list of all products
exports.userProducts = (req, res, next) => {
  if (req.user.isAdmin) {
    Product.find()
      .populate("seller")
      .exec((err, result) => {
        if (err) {
          res.status(400).json({ message: "Couldn't find user" });
        } else {
          res.status(200).json(result);
        }
      });
  } else {
    Product.find({ seller: req.params.userId })
      .populate("seller")
      .exec((err, result) => {
        if (err) {
          res.status(400).json({ message: "Couldn't find user" });
        } else {
          res.status(200).json(result);
        }
      });
  }
};

// Multer handling image upload Middleware at /api/product/create
exports.handleImages = function (fileName) {
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

  upload = multer({ storage: storage, fileFilter: fileFilter });

  return upload.single(fileName);
};

// handle POST request at /api/product/create to create a new product
// will pass an array of functions as a middleware
exports.createProduct = [
  //validate product that it's not empthy
  // then sanitize it with trima and escape
  body("name")
    .isLength({ min: 2 })
    .withMessage("Must be at least 2 letters")
    .trim()
    .escape(),
  body("description")
    .isLength({ min: 10 })
    .withMessage("Must be at least 10 letters")
    .trim()
    .escape(),
  body("category")
    .isLength({ min: 1 })
    .withMessage("This field is required")
    .trim()
    .escape(),
  body("price")
    .isLength({ min: 1 })
    .withMessage("Must be at least 1 number")
    .isNumeric()
    .withMessage("Must be Numeric")
    .trim()
    .escape(),
  body("numberInStock")
    .isLength({ min: 1 })
    .withMessage("Must be at least 1 number")
    .isNumeric()
    .withMessage("Must be Numeric")
    .trim()
    .escape(),

  // continue process after validation
  (req, res, next) => {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // get the validation errors from the request
    const errors = validationResult(req);

    // create new product after being validated and sanitized
    let newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      seller: req.user.id,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      productImage: req.file.path
    });

    // if there are errors send them as json
    if (!errors.isEmpty()) {
      let field = errors.errors[0].param;
      let message = errors.errors[0].msg;
      let errorMessage = field + " " + message;

      res.status(400).json({
        message: errorMessage
      });
    } else {
      newProduct.save(function (err, product) {
        if (err) {
          res.status(400).json({
            message: "Couldn't create please try again"
          });
        } else {
          res.status(200).json({
            message: "Added Succefulyl",
            product
          });
        }
      });
    }
  }
];

// handle GET request at /api/product/:id to get details for a specific product
exports.productDetails = (req, res) => {
  Product.findById(req.params.id)
    .populate("category")
    .populate("seller")
    .exec(function (err, result) {
      if (err) {
        res.status(404).json({ message: "Not Found" });
      } else {
        res.json(result);
      }
    });
};

// handle DELETE request at /api/product/:id/delete to delete an item by its id
exports.deleteProduct = (req, res) => {
  Product.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({ message: "Couldn't delete, try again" });
    } else {
      res.status(200).json({ message: "Deleted Successfully" });
    }
  });
};

// handle POST request at /api/product/:id/update to update an item
exports.updateProduct = [
  //validate product that it's not empthy
  // then sanitize it with trima and escape
  body("name")
    .isLength({ min: 5 })
    .withMessage("Must be at least 2 letters")
    .trim()
    .escape(),
  body("description")
    .isLength({ min: 10 })
    .withMessage("Must be at least 10 letters")
    .trim()
    .escape(),
  body("category", "This field is required").isLength({ min: 1 }).trim().escape(),
  body("price")
    .isLength({ min: 1 })
    .withMessage("Must be at least 1 number")
    .isNumeric()
    .withMessage("Must be Numeric")
    .trim()
    .escape(),
  body("numberInStock")
    .isLength({ min: 1 })
    .withMessage("Must be at least 1 number")
    .isNumeric()
    .withMessage("Must be Numeric")
    .trim()
    .escape(),

  (req, res, next) => {
    // get validation errors if there are any
    const errors = validationResult(req);

    // if there are validation errors send them in json
    if (!errors.isEmpty()) {
      let fieldName = errors.errors[0].param;
      let errorMessage = errors.errors[0].msg;
      let message = fieldName + " " + errorMessage;

      res.status(400).json({ message });
    } else {
      // find one product in the database to get the same image
      //if the user won't update the image
      Product.findById(req.params.id, "productImage")
        .then(function (product) {
          // create updated product with the provided data
          let updatedProduct = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            productImage: req.file ? req.file.path : product.productImage
          };

          Product.findByIdAndUpdate(req.params.id, updatedProduct, {
            new: true,
            useFindAndModify: false
          })
            .then(product => {
              res.status(200).json({
                message: "Successfuly Updated",
                product
              });
            })
            .catch(err => res.json(400).json({ message: "Error updating" }));
        })
        .catch(err => res.json(err));
    }
  }
];
