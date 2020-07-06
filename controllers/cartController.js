const Cart = require("./../models/Cart");
const mongoose = require("mongoose");

// handle get request at "/api/users/user"
exports.addToCart = (req, res) => {
  const user = req.user.id;

  const item = {
    product: req.query.productId,
    quantity: 1,
    orderState: {
      pending: true,
      shipped: false,
      delivered: false,
      returned: false,
      refunded: false
    }
  };

  Cart.findOne({ user: user }, (err, foundCart) => {
    if (err) {
      res.status(400).json({ message: "Couldn't find user cart", err });
    } else if (foundCart) {
      let productsInCart = foundCart.items.map(item => item.product);
      // check if the item already in the cart
      // if it's there increase the quantity by 1
      if (productsInCart.includes(item.product)) {
        Cart.findOneAndUpdate(
          {
            user: user,
            items: { $elemMatch: { product: item.product } }
          },
          { $inc: { "items.$.quantity": 1 } },
          { new: true, useFindAndModify: false },
          (err, cart) => {
            if (err) {
              res.status(400).json({ message: "Couldn't add to cart", err });
            } else {
              res.status(200).json({ message: "Added to cart", cart });
            }
          }
        );
      } else {
        foundCart.items.push(item);
        foundCart.save().then(cart => {
          res.status(200).json({ message: "Added to cart", cart });
        });
      }
    } else {
      Cart.create({ user: user, items: [item] })
        .then(cart => {
          res.status(200).json({ message: "Added to cart", cart });
        })
        .catch(err => {
          res.status(400).json({ message: "Couldn't add to cart", err });
        });
    }
  });
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
          res.status(200).json({ message: "cart", cart });
        }
      }
    });
};

//handle GET at api/users/removeFromCart?productId=
exports.removeFromCart = (req, res) => {
  let userId = req.user.id;

  Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { product: req.query.productId } } },
    { new: true, useFindAndModify: false },
    (err, cart) => {
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
              res.status(200).json({ message: "Deleted Succefully", cart });
            }
          });
      }
    }
  );
};
