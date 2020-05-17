const express = require("express");
const router = express.Router();
const passport = require("passport");

const UsersController = require("../controllers/users.controller");

// Get user details based on request
router.route("/:id").get(UsersController.GetUser);

module.exports = router;
