const express = require("express");
const router = express.Router();
const passport = require("passport");

const { validateBody, schemas } = require("../helpers/route.helper");
const AuthController = require("../controllers/auth.controller");
require("../passport");

// Controller for the sign-up uri
router
  .route("/sign-up")
  .post(validateBody(schemas.registerSchema), AuthController.SignUp);

// Controller for the sign-up-final uri
router
  .route("/sign-up-final")
  .post(validateBody(schemas.registerFinalSchema), AuthController.SignUpFinal);

// Controller for the sign-in uri
router
  .route("/sign-in")
  .post(
    validateBody(schemas.authSchema),
    passport.authenticate("local", { session: false }),
    AuthController.SignIn
  );

// Controller for the sign-up uri
router
  .route("/forgot-password")
  .post(
    validateBody(schemas.forgotPasswordSchema),
    AuthController.ForgotPassword
  );

// Controller for the Google OAuth
router
  .route("/oauth/google")
  .post(
    passport.authenticate("googleToken", { session: false }),
    AuthController.GoogleOAuth
  );

// Controller for the Facebook OAuth
router
  .route("/oauth/facebook")
  .post(
    passport.authenticate("facebookToken", { session: false }),
    AuthController.FacebookOAuth
  );

module.exports = router;
