const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const order_controller = require("./../../controllers/orderController");

// @route   GET api/order/orderSuccess
// @desc    Finish the order and move the cart to history
// @access  private
router.get("/orderSuccess", auth, order_controller.orderSuccess);

// @route   GET api/order/userOrdersHistory
// @desc    Get all user's orders
// @access  private
router.get("/userOrdersHistory", auth, order_controller.userOrdersHistory);

// @route   GET api/order/ordersToDeliver
// @desc    Get all seller's orders to be delivered
// @access  private
router.get("/ordersToDeliver", auth, order_controller.ordersToDeliver);

// @route   PUT api/order/ordersToDeliver/markAsShipped
// @desc    Edit seller's order's state to be shipped
// @access  private
router.get("/ordersToDeliver/markAsShipped", auth, order_controller.markAsShipped);

module.exports = router;
