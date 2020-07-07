const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const wishlist_controller = require("./../../controllers/wishlistController");

// @route   GET api/wishlist/addToWishlist?productId=
// @desc    Add item to the wish list
// @access  private
router.get("/addToWishlist", auth, wishlist_controller.addToWishlist);

// @route   GET api/wishlist/userWishlist
// @desc    Get user wish list info
// @access  private
router.get("/userWishlist", auth, wishlist_controller.userWishlist);

// @route   GET api/wishlist/removeFromWishlist?productId=12313213213
// @desc    Remove an item from the Wishlist
// @access  private
router.get("/removeFromWishlist", auth, wishlist_controller.removeFromWishlist);

module.exports = router;
