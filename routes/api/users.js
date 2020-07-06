const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const users_controller = require("./../../controllers/userController");

// @route   POST api/users/signup
// @desc    send user data for registeration
// @access  public
router.post("/signup", users_controller.createUser);

// @route   POST api/users/login
// @desc    send user data for logging in
// @access  public
router.post("/login", users_controller.login);

// @route   GET api/users/user
// @desc    Get user data
// @access  private
router.get("/user", auth, users_controller.getUser);

// @route   PUT api/users/edit_account
// @desc    Edit user data
// @access  private
router.put("/edit_account", auth, users_controller.editUser);

// @route   GET api/users/addToWishlist?productId=
// @desc    Add item to the wish list
// @access  private
router.get("/addToWishlist", auth, users_controller.addToWishlist);

// @route   GET api/users/userWishlist
// @desc    Get user wish list info
// @access  private
router.get("/userWishlist", auth, users_controller.userWishlist);

// @route   GET api/users/removeFromWishlist?productId=12313213213
// @desc    Remove an item from the Wishlist
// @access  private
router.get("/removeFromWishlist", auth, users_controller.removeFromWishlist);

// @route   GET api/users/ordersToDeliver
// @desc    Get all seller's orders to be delivered
// @access  private
router.get("/ordersToDeliver", auth, users_controller.ordersToDeliver);

// @route   PUT api/users/ordersToDeliver/markAsShipped
// @desc    Edit seller's order's state to be shipped
// @access  private
router.get("/ordersToDeliver/markAsShipped", auth, users_controller.markAsShipped);

module.exports = router;
