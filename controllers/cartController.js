const Cart = require("./../models/Cart");
const Product = require("./../models/ProductModel");

// handle get request at "/api/cart/addToCart?productId="
exports.addToCart = (req, res) => {
  const userId = req.user.id;

  const productId = req.query.productId;

  // prepare new item for the cart
  const item = {
    product: productId,
    quantity: req.body.orderQuantity == null || 0 ? 1 : req.body.orderQuantity,
    orderState: {
      pending: true,
      shipped: false,
      delivered: false,
      returned: false,
      refunded: false
    }
  };

  // first we need to check if the item is in the stock
  // just in case the customer views a product and it's the last piece
  // and another user orders it before him
  Product.findById(productId, (err, foundProduct) => {
    // if the item stock = 0 end with this respond
    if (foundProduct.numberInStock === 0) {
      return res.status(400).json({
        message: "The product went out of stock."
      });
    } else {
      // else call the addToCart function to complete the proccess
      addToCart();
    }
  });

  // add an item to cart
  function addToCart() {
    // 1- find the cart by user's id and if it's there step 2
    Cart.findOne({ user: userId }, (err, foundCart) => {
      if (err) {
        res.status(400).json({
          message: "Couldn't find user cart",
          err
        });
      } else if (foundCart) {
        let productsInCart = foundCart.items.map(item => item.product);

        // 2- check if the item already in the cart, if it's there
        if (productsInCart.includes(productId)) {
          //if the user add it without a quantity
          // then notify him it's already in cart
          if (!req.body.orderQuantity) {
            res.status(400).json({
              message: "Product already in cart"
            });
          } else {
            // if he ordered it again from inside the product itself
            // and change the quantity, update the quantity with the new one
            Cart.findOneAndUpdate(
              {
                user: userId,
                items: {
                  $elemMatch: { product: productId }
                }
              },
              { $set: { "items.$.quantity": req.body.orderQuantity } },
              { new: true, useFindAndModify: false },
              (err, cart) => {
                if (err) {
                  res.status(400).json({
                    message: "Couldn't add to cart",
                    err
                  });
                } else {
                  res.status(200).json({
                    message: "Quantity changed in the cart",
                    cart
                  });
                }
              }
            );
          }
        } else {
          // 3- if the item isn't in the cart, push it in cart items
          foundCart.items.push(item);
          foundCart.save().then(cart => {
            res.status(200).json({ message: "Added to cart", cart });
          });
        }
      } else {
        // 4- if there isn't a cart for this user
        // create a new one with his id and push the item in the cart
        Cart.create({ user: userId, items: [item] })
          .then(cart => {
            res.status(200).json({ message: "Added to cart", cart });
          })
          .catch(err => {
            res.status(400).json({
              message: "Couldn't add to cart",
              err
            });
          });
      }
    });
  }
};

// handle GET at api/cart/userCartInfo
exports.userCartInfo = (req, res) => {
  let userId = req.user.id;

  Cart.findOne({ user: userId })
    .populate("items.product")
    .exec((err, cart) => {
      if (err) {
        res.status(400).json({ message: "Couldn't find cart", err });
      } else {
        if (!cart) {
          res.status(400).json({ message: "no cart" });
        } else {
          let cartItems = cart.items;
          let total = cartItems.reduce(function (a, b) {
            return a + b.product.price * b.quantity;
          }, 0);

          Cart.findOneAndUpdate(
            { user: userId },
            { totalPrice: total },
            { new: true, useFindAndModify: false }
          )
            .populate("items.product")
            .then(cart => {
              res.status(200).json({ message: "cart", cart });
            });
        }
      }
    });
};

//handle GET at api/cart/removeFromCart?productId=
exports.removeFromCart = (req, res) => {
  let userId = req.user.id;

  Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { product: req.query.productId } } },
    { new: true, useFindAndModify: false },
    err => {
      if (err) {
        res.status(400).json({ message: "Couldn't find cart", err });
      } else {
        // we need to populate the cart products again
        Cart.findOne({ user: userId })
          .populate("items.product")
          .exec((err, cart) => {
            if (err) {
              res.status(400).json({ message: "Couldn't find cart", err });
            } else {
              // count the new total price of the order
              let cartItems = cart.items;
              let total = cartItems.reduce(function (a, b) {
                return a + b.product.price * b.quantity;
              }, 0);

              // then find the same cart and update the total price
              Cart.findOneAndUpdate(
                { user: userId },
                { totalPrice: total },
                { new: true, useFindAndModify: false }
              )
                .populate("items.product")
                .then(cart => {
                  res.status(200).json({ message: "Deleted Succefully", cart });
                });
            }
          });
      }
    }
  );
};

// handle put request at "/api/cart/changeQuantityFromCart?productId="
exports.changeQuantityFromCart = (req, res) => {
  const userId = req.user.id;

  const productId = req.query.productId;

  Cart.findOneAndUpdate(
    {
      user: userId,
      items: {
        $elemMatch: { _id: productId }
      }
    },
    { $set: { "items.$.quantity": req.body.orderQuantity } },
    { new: true, useFindAndModify: false }
  )
    .populate({ path: "items.product", model: "Product" })
    .exec((err, cart) => {
      if (err) {
        res.status(400).json({
          message: "Couldn't add to cart",
          err
        });
      } else {
        // count the new total price of the order
        let cartItems = cart.items;
        let total = cartItems.reduce(function (a, b) {
          return a + b.product.price * b.quantity;
        }, 0);

        // then find the same cart and update the total price
        Cart.findOneAndUpdate(
          { user: userId },
          { totalPrice: total },
          { new: true, useFindAndModify: false }
        )
          .populate("items.product")
          .then(cart => {
            res.status(200).json({ message: "Quantity changed in the cart", cart });
          });
      }
    });
};

// handle put request at "/api/cart/chooseOrderAddress"
exports.chooseOrderAddress = (req, res) => {
  const userId = req.user.id;

  Cart.findOneAndUpdate(
    { user: userId },
    { $set: { address: req.body.address } },
    { new: true, useFindAndModify: false }
  ).exec((err, cart) => {
    if (err) {
      res.status(400).json({
        message: "Couldn't update address",
        err
      });
    } else {
      res.status(200).json(cart);
    }
  });
};
