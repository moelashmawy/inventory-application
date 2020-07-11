const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../../middlewares/auth");
const permissions_controller = require("./../../controllers/permissionsController");

// @route   GET api/permissions/allUsers
// @desc    Get all users
// @access  Admin only
router.get("/allUsers", auth, adminAuth, permissions_controller.getAllUsers);

// @route   GET api/permissions/allShippers
// @desc    Get all shippers
// @access  Admin only
router.get("/allShippers", auth, adminAuth, permissions_controller.getAllShippers);

// @route   PUT /api/permissions/addShipper
// @desc    Add permissions to any user to be a shipper
// @access  private & only admin
router.put("/addShipper", auth, adminAuth, permissions_controller.addShipper);

// @route   PUT /api/permissions/addShipperInfo
// @desc    Add permissions to any user to be a shipper
// @access  private & only admin
router.put("/addShipperInfo", auth, adminAuth, permissions_controller.addShipperInfo);

// @route   PUT /api/permissions/addAdmin
// @desc    Add permissions to any user to be an Admin
// @access  private & only admin
router.put("/addAdmin", auth, adminAuth, permissions_controller.addAdmin);

// @route   PUT /api/permissions/restrictUser
// @desc    Restrict user from doing any function
// @access  private & only admin
router.put("/restrictUser", auth, adminAuth, permissions_controller.restrictUser);

module.exports = router;
