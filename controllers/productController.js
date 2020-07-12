const Product = require("../models/ProductModel");

// handle GET request at /api/product to get list of all products in stock
exports.productIndex = (req, res) => {
  Product.find()
    .sort({ creationDate: -1 })
    .then(allProducts => {
      let productsInStock = allProducts.filter(item => item.numberInStock !== 0);
      res.json({ products: productsInStock });
    });
};

// handle GET request at /api/product/:userId/products to get list of all products
exports.userProducts = (req, res) => {
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

// handle POST request at /api/product/create to create a new product
// will pass an array of functions as a middleware
exports.createProduct = (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: "Please upload an image" });
  }

  // create new product after being validated and sanitized
  let newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    seller: req.user.id,
    price: req.body.price,
    numberInStock: req.body.numberInStock,
    productImage: req.files
  });

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
};

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
  Product.findByIdAndDelete(req.params.id, err => {
    if (err) {
      res.status(400).json({ message: "Couldn't delete, try again" });
    } else {
      res.status(200).json({ message: "Deleted Successfully" });
    }
  });
};

// handle POST request at /api/product/:id/update to update an item
exports.updateProduct = (req, res) => {
  // find one product in the database to get the same images
  //if the user won't update the images
  Product.findById(req.params.id, "productImage")
    .then(function (product) {
      // create updated product with the provided data
      let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        productImage: req.files ? req.files : product.productImage
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
        .catch(() => res.json(400).json({ message: "Error updating" }));
    })
    .catch(err => res.json(err));
};
