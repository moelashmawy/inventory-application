const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const users_controller = require("./../../controllers/userController");
const users_validation = require("../../middlewares/validation/validateUser");

// @route   POST api/users/signup
// @desc    send user data for registeration
// @access  public
router.post("/signup", users_validation.validateRegister, users_controller.createUser);

// @route   POST api/users/login
// @desc    send user data for logging in
// @access  public
router.post("/login", users_validation.validateLogin, users_controller.login);

// @route   GET api/users/user
// @desc    Get user data
// @access  private
router.get("/user", auth, users_controller.getUser);

// @route   PUT api/users/edit_account
// @desc    Edit user data
// @access  private
router.put(
  "/edit_account",
  auth,
  users_validation.validateEditUser,
  users_controller.editUser
);

module.exports = router;
