const User = require("./../models/UsersModel");
const Product = require("./../models/ProductModel");
const Cart = require("./../models/Cart");
const Order = require("./../models/Order");

//handle GET at /api/order/orderSuccess to finish the order and move the cart to history
exports.orderSuccess = (req, res) => {
  let userId = req.user.id;

  // find the current user cart
  Cart.findOne({ user: userId }).then(cart => {
    // if the cart is empty, end with 400 respond
    if (!cart) {
      res.status(400).json({ message: "Your cart is empty" });
    } else {
      let cartInfo = cart.items;

      // we need to notify each seller about the purchased products
      // we have the cart informations about each product and quantity
      // 1- go to each item the user purchased
      // 2- find its seller
      // 3- edit the seller's ordersToDeliver
      // by adding the products and amount
      cartInfo.forEach(item => {
        Product.findOne({ _id: item.product })
          .populate("seller", "ordersToDeliver")
          .exec((err, product) => {
            if (err) {
              res.status(400).json({
                message: "Couldn't get items",
                err
              });
            } else {
              User.findOneAndUpdate(
                { _id: product.seller._id },
                {
                  $push: {
                    ordersToDeliver: item
                  }
                },
                {
                  new: true,
                  useFindAndModify: false
                },
                (err, productSeller) => {
                  if (err) {
                    return res.status(400).json({
                      message: "Couldn't update orders to deliver",
                      err
                    });
                  }
                }
              );
            }
          });
      });

      // we need to decreament the item's number in stock
      cartInfo.forEach(item => {
        Product.updateOne(
          { _id: item.product },
          {
            $inc: {
              numberInStock: -item.quantity
            }
          },
          { new: true },
          (err, item) => {
            if (err) {
              return res
                .status(400)
                .json({ message: "Couldn't decrease item's quantity", err });
            }
          }
        );
      });

      // Then create a new order related to the user
      // 1- find the user's cart
      // 2- create a new order and its products are the user's cart items
      // 3- empty the user's cart
      Cart.findOne({ user: userId }).then(foundCart => {
        Order.create({
          user: userId,
          products: foundCart.items,
          totalPrice: foundCart.totalPrice
        }).then(() => {
          // Then empty the user's cart
          Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [], totalPrice: 0 } },
            { new: true, useFindAndModify: false },
            (err, cart) => {
              if (err) res.status(400).json({ message: "Error in order", err });
              else {
                res.status(200).json({ message: "Ordered Placed", cart });
              }
            }
          );
        });
      });
    }
  });
};

//handle GET at api/order/userOrdersHistory to Get all user's orders
exports.userOrdersHistory = (req, res) => {
  let userId = req.user.id;

  Order.find({ user: userId })
    .sort({ orderDate: -1 })
    .populate({
      path: "products.product",
      model: "Product",
      populate: {
        path: "seller",
        model: "User",
        select: "username"
      }
    })
    .exec((err, orders) => {
      if (err) {
        res.status(400).json({ message: "Couldn't find cart", err });
      } else {
        res.status(200).json({ message: "All user's orders", orders });
      }
    });
};
