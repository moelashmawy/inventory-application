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

// @route   GET api/users/ordersToDeliver
// @desc    Get all seller's orders to be delivered
// @access  private
router.get("/ordersToDeliver", auth, users_controller.ordersToDeliver);

// @route   PUT api/users/ordersToDeliver/markAsShipped
// @desc    Edit seller's order's state to be shipped
// @access  private
router.get("/ordersToDeliver/markAsShipped", auth, users_controller.markAsShipped);

module.exports = router;
