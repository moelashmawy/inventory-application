const Product = require("./../models/ProductModel");
const Cart = require("./../models/Cart");
const Order = require("./../models/Order");
const Shipper = require("./../models/Shipper");
const mongoose = require("mongoose");

exports.orderSuccess = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Your cart is empty" });
    }

    if (!cart.address) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Please Select order address" });
    }

    const cartInfo = cart.items;

    for (const item of cartInfo) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }
      if (product.numberInStock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}. Available: ${product.numberInStock}, Requested: ${item.quantity}`
        });
      }
    }

    for (const item of cartInfo) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { numberInStock: -item.quantity } },
        { session }
      );
    }

    await Order.create(
      [
        {
          user: userId,
          products: cartInfo,
          totalPrice: cart.totalPrice,
          address: cart.address
        }
      ],
      { session }
    );

    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [], totalPrice: 0, address: null } },
      { new: true, useFindAndModify: false, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Ordered Placed" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: "Error in order", err });
  }
};

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
    .populate("address")
    .exec((err, orders) => {
      if (err) {
        res.status(400).json({ message: "Couldn't find cart", err });
      } else {
        res.status(200).json({ message: "All user's orders", orders });
      }
    });
};

exports.ordersToShip = (req, res) => {
  let userId = req.user.id;

  Order.aggregate(
    [
      { $unwind: "$products" },
      { $unwind: "$products.product" },
      { $sort: { orderDate: 1 } }
    ],
    function (err, result) {
      Order.populate(
        result,
        [
          {
            path: "products.product",
            model: "Product"
          },
          { path: "address", model: "Address" }
        ],
        function (err, results) {
          let sellerItemsToShip = results.filter(
            order =>
              order.products.product.seller == userId &&
              order.products.orderState.shipped == false
          );
          if (err) res.status(400).json({ message: "Couldn't get orders", err });
          return res.status(200).json({ ordersToShip: sellerItemsToShip });
        }
      );
    }
  );
};

exports.shippedOrders = (req, res) => {
  let userId = req.user.id;

  Order.aggregate(
    [
      { $unwind: "$products" },
      { $unwind: "$products.product" },
      { $sort: { orderDate: -1 } }
    ],
    function (err, result) {
      Order.populate(
        result,
        [
          {
            path: "products.product",
            model: "Product"
          },
          { path: "address", model: "Address" }
        ],
        function (err, results) {
          let sellerShippedOrders = results.filter(
            order =>
              order.products.product.seller == userId &&
              order.products.orderState.shipped == true
          );
          if (err) res.status(400).json({ message: "Couldn't get orders", err });
          return res.status(200).json({ shippedOrders: sellerShippedOrders });
        }
      );
    }
  );
};

exports.markAsShipped = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderId = req.query.orderId;
    const userId = req.user.id;

    const order = await Order.findOne({
      products: { $elemMatch: { _id: mongoose.Types.ObjectId(orderId) } }
    })
      .populate("products.product")
      .session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItem = order.products.find(
      item => item._id.toString() === orderId
    );

    if (!orderItem) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order item not found" });
    }

    if (orderItem.product.seller.toString() !== userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "You are not authorized to ship this order" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        products: {
          $elemMatch: {
            _id: mongoose.Types.ObjectId(orderId),
            "orderState.pending": true,
            "orderState.shipped": false
          }
        }
      },
      {
        $set: {
          "products.$.orderState.shipped": true,
          "products.$.orderState.pending": false,
          shippedDate: Date.now()
        }
      },
      { new: true, useFindAndModify: false, session }
    ).populate("products.product");

    if (!updatedOrder) {
      await session.abortTransaction();
      session.endSession();
      if (orderItem.orderState.shipped) {
        return res.status(400).json({ message: "Order is already shipped" });
      }
      if (!orderItem.orderState.pending) {
        return res.status(400).json({ message: "Order is not in pending state" });
      }
      return res.status(400).json({ message: "Order state has changed, please refresh and try again" });
    }

    const shippedOrder = updatedOrder.products.filter(
      item => item._id.toString() === orderId
    );
    const updatedItemOnly = shippedOrder[0];

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Marked as shipped", shippedOrder: updatedItemOnly });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: "Couldn't mark shipped, try again.", err });
  }
};

exports.ordersToDeliver = (req, res) => {
  let userId = req.user.id;

  Shipper.findOne({ user: userId }, (err, shipper) => {
    if (err) {
      return res.status(400).json({ message: "Couldn't find shipper", err });
    }
    if (!shipper) {
      return res.status(404).json({ message: "Shipper not found" });
    }

    Order.find()
      .sort({ orderDate: -1 })
      .populate("address")
      .populate({ path: "products.product", model: "Product" })
      .exec((err, orders) => {
        if (err) {
          return res.status(400).json({ message: "Couldn't get orders", err });
        }

        let areaOrders = orders.filter(order => {
          if (!order.address || !order.address.state) return false;
          if (order.address.state !== shipper.area) return false;

          const hasShippedNotDelivered = order.products.some(
            product => product.orderState.shipped === true && product.orderState.delivered === false
          );
          return hasShippedNotDelivered;
        });

        res.json({ areaOrders });
      });
  });
};

exports.markAsDelivered = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderId = req.query.orderId;
    const userId = req.user.id;

    const order = await Order.findOne({
      products: { $elemMatch: { _id: mongoose.Types.ObjectId(orderId) } }
    })
      .populate("address")
      .populate("products.product")
      .session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItem = order.products.find(
      item => item._id.toString() === orderId
    );

    if (!orderItem) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order item not found" });
    }

    const shipper = await Shipper.findOne({ user: userId }).session(session);
    if (!shipper) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "You are not authorized as a shipper" });
    }

    if (order.address && order.address.state !== shipper.area) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "This order is not in your delivery area" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        products: {
          $elemMatch: {
            _id: mongoose.Types.ObjectId(orderId),
            "orderState.shipped": true,
            "orderState.delivered": false
          }
        }
      },
      {
        $set: {
          "products.$.orderState.delivered": true,
          deliveredDate: Date.now()
        }
      },
      { new: true, useFindAndModify: false, session }
    )
      .populate("address")
      .populate("products.product");

    if (!updatedOrder) {
      await session.abortTransaction();
      session.endSession();
      if (orderItem.orderState.delivered) {
        return res.status(400).json({ message: "Order is already delivered" });
      }
      if (!orderItem.orderState.shipped) {
        return res.status(400).json({ message: "Order must be shipped before it can be delivered" });
      }
      return res.status(400).json({ message: "Order state has changed, please refresh and try again" });
    }

    const deliveredOrder = updatedOrder.products.filter(
      item => item._id.toString() === orderId
    );
    const updatedItemOnly = deliveredOrder[0];

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Marked as delivered",
      order: updatedOrder,
      deliveredItem: updatedItemOnly
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: "Couldn't mark delivered, try again.", err });
  }
};
