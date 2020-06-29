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

// @route   GET api/users/addToCart?productId=
// @desc    Add item to the cart
// @access  private
router.get("/addToCart", auth, users_controller.addToCart);

// @route   GET api/users/userCartInfo
// @desc    Get user cart info
// @access  private
router.get("/userCartInfo", auth, users_controller.userCartInfo);

// @route   GET api/users/removeFromCart?productId=12313213213
// @desc    Remove an item from the cart
// @access  private
router.get("/removeFromCart", auth, users_controller.removeFromCart);

// @route   POST api/users/addresses?action=add
// @desc    Add a user address
// @access  private
router.post("/addresses", auth, users_controller.addAddress);

// @route   PUT api/users/addresses?action=edit&address=12313123123
// @desc    Edit a user address
// @access  private
router.put("/addresses", auth, users_controller.editAddress);

// @route   DELETE api/users/addresses?action=delete&address=12313123123
// @desc    delete a user address
// @access  private
router.delete("/addresses", auth, users_controller.deleteAddress);

// @route   GET api/users/addresses
// @desc    get user addresses
// @access  private
router.get("/addresses", auth, users_controller.getAddresses);

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

module.exports = router;
