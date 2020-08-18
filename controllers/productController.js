const Product = require("../models/ProductModel");
const User = require("../models/UsersModel");

// handle GET request at /api/product to get list of all products in stock
exports.allProducts = (req, res) => {
  let page = req.query.page || 1;
  let perPage = parseInt(req.query.perPage) || 8;

  Product.paginate(
    { numberInStock: { $ne: 0 } },
    { sort: { creationDate: -1 }, page: page, limit: perPage },
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "Couldn't find products" });
      } else {
        res.status(200).json({ products: result.docs, pagesCount: result.pages });
      }
    }
  );
};

// handle GET request at /api/product/my_products to get list of all products
// paginate is a mongoose external plugin to handle pagination
exports.userProducts = (req, res) => {
  let page = req.query.page || 1;
  let perPage = parseInt(req.query.perPage);

  // if the user us admin, let him fetch all the products
  if (req.user.isAdmin) {
    Product.paginate(
      {},
      { sort: { creationDate: -1 }, populate: "seller", page: page, limit: perPage },
      (err, result) => {
        if (err) {
          res.status(400).json({ message: "Couldn't find products" });
        } else {
          res.status(200).json({ products: result.docs, pagesCount: result.pages });
        }
      }
    );
  } else {
    // if the user isn't admin then he will just be able to edit his products
    Product.paginate(
      { seller: req.user.id },
      { sort: { creationDate: -1 }, populate: "seller", page: page, limit: perPage },
      (err, result) => {
        if (err) {
          res.status(400).json({ message: "Couldn't find products" });
        } else {
          res
            .status(200)
            .json({ products: result.docs, current: result.page, pages: result.pages });
        }
      }
    );
  }
};

// handle POST request at /api/product/create to create a new product
// will pass an array of functions as a middleware
exports.createProduct = (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: "Please upload an image" });
  }

  const images_url = req.files.map(image => image.path);

  // create new product after being validated and sanitized
  let newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    seller: req.user.id,
    price: req.body.price,
    numberInStock: req.body.numberInStock,
    productImage: images_url
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
// we will only allow one user who is "admin" to delete products
// cause every product has instances and i didn't handle deleting them
exports.deleteProduct = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (user.username != "admin") {
      res.status(400).json({ message: "You can't delete, please contact your admin" });
    } else {
      Product.findByIdAndDelete(req.params.id, err => {
        if (err) {
          res.status(400).json({ message: "Couldn't delete, try again" });
        } else {
          res.status(200).json({ message: "Deleted Successfully" });
        }
      });
    }
  });
};

// handle POST request at /api/product/:id/update to update an item
exports.updateProduct = (req, res) => {
  const images_url = req.files.map(image => image.path);

  // find one product in the database to get the same images
  //if the user won't update the images
  Product.findById(req.params.id, "productImage")
    .then(product => {
      // create updated product with the provided data
      let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        productImage: req.files[0] ? images_url : product.productImage
      };

      // update with the new data
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
