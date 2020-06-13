const express = require("express");
const router = express.Router();

const users_controller = require("./../../controllers/userController");

// to handle post requests at "api/users/signup"
router.post("/signup", users_controller.createUser);

module.exports = router;
