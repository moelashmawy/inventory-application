const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const cart_controller = require("./../../controllers/cartController");

// @route   GET api/cart/addToCart?productId=
// @desc    Add item to the cart
// @access  private
router.get("/addToCart", auth, cart_controller.addToCart);

// @route   GET api/cart/userCartInfo
// @desc    Get user cart info
// @access  private
router.get("/userCartInfo", auth, cart_controller.userCartInfo);

// @route   GET api/cart/removeFromCart?productId=12313213213
// @desc    Remove an item from the cart
// @access  private
router.get("/removeFromCart", auth, cart_controller.removeFromCart);

module.exports = router;
