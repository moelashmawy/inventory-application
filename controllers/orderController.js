const User = require("./../models/UsersModel");
const Product = require("./../models/ProductModel");
const Cart = require("./../models/Cart");
const Order = require("./../models/Order");
const Shipper = require("./../models/Shipper");
const mongoose = require("mongoose");

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
              return res.status(400).json({
                message: "Couldn't decrease item's quantity",
                err
              });
            }
          }
        );
      });

      // Then create a new order related to the user
      // 1- find the user's cart
      // 2- create a new order, and its products are the user's cart items
      // 3- empty the user's cart
      Cart.findOne({ user: userId }).then(foundCart => {
        Order.create({
          user: userId,
          products: foundCart.items,
          totalPrice: foundCart.totalPrice,
          address: foundCart.address
        }).then(() => {
          // Then empty the user's cart
          Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [], totalPrice: 0 } },
            { new: true, useFindAndModify: false },
            (err, cart) => {
              if (err)
                res.status(400).json({
                  message: "Error in order",
                  err
                });
              else {
                res.status(200).json({
                  message: "Ordered Placed",
                  cart
                });
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

//handle GET at api/order/ordersToShip to all seller's orders to be delivered
exports.ordersToShip = (req, res) => {
  let userId = req.user.id;

  Order.find()
    .populate({ path: "products.product", model: "Product" })
    .exec((err, orders) => {
      if (err) res.status(400).json({ message: "Couldn't find user", err });
      else {
        let len = orders.length;
        let orderCurInx = 0;
        let ordersToShip = [];

        orders.forEach(order => {
          ++orderCurInx;

          order.products.forEach(product => {
            if (product.product.seller == userId) {
              ordersToShip.push(product);
            }
          });
        });

        if (len == orderCurInx) {
          return res.status(200).json({ ordersToShip });
        }
      }
    });
};

//handle GET at api/order/ordersToShip/markAsShipped to all seller's orders to be delivered
exports.markAsShipped = (req, res) => {
  let orderId = req.query.orderId;

  // we want to change the item state in the orders
  // so the customer who ordered the product can track
  // the order state
  Order.findOneAndUpdate(
    {
      products: { $elemMatch: { _id: mongoose.Types.ObjectId(orderId) } }
    },
    { $set: { "products.$.orderState.shipped": true } },
    { new: true, useFindAndModify: false },
    (err, order) => {
      if (err) {
        res.status(400).json({ message: "Couldn't mark shipped, try again.", err });
      } else {
        // order contains the whole items in the order and we want to return just our updated item
        let shippedOrder = order.products.filter(item => item._id == req.query.orderId);
        let updatedItemOnly = shippedOrder[0];

        res
          .status(200)
          .json({ message: "Marked as shipped", shippedOrder: updatedItemOnly });
      }
    }
  );
};

//handle GET at api/order/ordersToDeliver to get all shipper's orders
exports.ordersToDeliver = (req, res) => {
  let userId = req.user.id;

  // 1- first we get the shipper to get his area
  Shipper.findOne({ user: userId }, (err, shipper) => {
    // 2- we get all the order's that has the same area as shipper
    Order.find()
      .sort({ orderDate: -1 })
      .populate("address")
      .populate({ path: "products.product", model: "Product" })
      .exec((err, orders) => {
        let areaOrders = orders.filter(order => order.address.state == shipper.area);
        res.json({ areaOrders });
      });
  });
};

//handle GET at api/order/ordersToDeliver/markAsDelivered to mark as delivered
exports.markAsDelivered = (req, res) => {
  let orderId = req.query.orderId;

  // we want to change the item state in the orders
  // so the customer who ordered the product can track
  // the order state
  Order.findOneAndUpdate(
    {
      products: { $elemMatch: { _id: mongoose.Types.ObjectId(orderId) } }
    },
    {
      $set: {
        "products.$.orderState.delivered": true,
        deliveredDate: Date().toString()
      }
    },
    { new: true, useFindAndModify: false }
  )
    .populate("address")
    .exec((err, order) => {
      if (err) {
        res.status(400).json({ message: "Couldn't mark delivered, try again.", err });
      } else {
        // order contains the whole items in the order and we want to return just our updated item
        let deliveredOrder = order.products.filter(item => item._id == req.query.orderId);
        let updatedItemOnly = deliveredOrder[0];

        res.status(200).json({
          message: "Marked as delivered",
          order,
          deliveredItem: updatedItemOnly
        });
      }
    });
};
