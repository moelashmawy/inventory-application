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

module.exports = router;
