const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const uploadImages = require("../middleware/uploads").uploadImages;

const { validateBody, schemas } = require("../helpers/route.helper");
const EventController = require("../controllers/events.controller");
require("../passport");

// Controller for the sign-up-final uri
router
  .route("/create-event")
  .post(passport.authenticate('jwt', { session: false }), uploadImages.single('thumbnail'), EventController.CreateEvent);

router
  .route("/event/:id")
  .get(EventController.GetEvent);

router
  .route("/")
  .get(EventController.GetEvents);

module.exports = router;
