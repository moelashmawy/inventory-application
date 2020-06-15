const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
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

module.exports = router;
