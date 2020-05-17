const JWT = require("jsonwebtoken");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const sendMail = require("../helpers/sendMail.helper");
const User = require("../models/user.model");
const TemporaryUser = require("../models/temporaryUser.model");
const { JWT_SECRET } = require("../config");

// Acces token generation
const signToken = user => {
  return JWT.sign(
    {
      iss: "reactAndNode", // issuer
      sub: user._id, // subject
      iat: moment().unix(), // issued at
      exp: moment()
        .add("7", "days")
        .unix() // experation time
    },
    JWT_SECRET
  ); // secret string key
};

/* ----- CONTROLLERS ----- */

// Sign up controller
const SignUp = async (req, res, next) => {
  try {
    const { email } = req.value.body;

    // Check if any temporary user was registered using the same email
    const foundTemporaryUser = await TemporaryUser.findOne({ "email": email });

    if (foundTemporaryUser) return res.status(403).json({ error: "Email is already in use for a temporary user" });

    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "local.email": email });

    // Check if the entered email by user isn't already in the database
    if (foundUser) {
      return res.status(403).json({ error: "Email is already in use" });
    }

    // Generating unique key for email validation
    const key = crypto.randomBytes(60).toString('hex');

    // Create a new user
    const newTemporaryUser = new TemporaryUser({
      email,
      confirmationKey: key
    });

    // Save the user
    await newTemporaryUser.save(error => {
      if (error) {
        console.log("Error on saving the temporary_user into the database ::", error);
        return res.status(500).json({ error });
      }
    });

    // Composing email
    const subject = 'Confirmati email-ul pentru contul EventsBook';
    const html = (`
      <h4>Salut pentru a confirma acceseaza acest 
        <a href="http://localhost:3000/register-details?email=${email}&key=${key}">link</a>
      </h4>
    `);

    // Sending the email
    await sendMail(email, subject, html);

    // Generating token for the registered user
    // const token = signToken(newUser);

    // Respond with token
    return res.status(201).json({ "message": "Temporary user was successfully created" });
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error}`);
  }
};

// Sign up final controller
const SignUpFinal = async (req, res, next) => {
  try {
    const {
      email,
      firstName,
      lastName,
      password,
      birthDate,
      currentStatus,
      country,
      city,
      genre,
      zipCode,
      phoneNumber
    } = req.value.body.local;

    // Check if email was registered as a temporary user before proceeding further
    const foundTemporaryUser = await TemporaryUser.findOne({ "email": email });
    console.log("1111111111111111111111111111111111");

    if (foundTemporaryUser) {
      console.log('temp user id ::', foundTemporaryUser.id)
      await TemporaryUser.findOneAndDelete({ _id: foundTemporaryUser.id });
    }
    else {
      return res.status(404).json({ error: "Email was not registered before" });
    }

    // Check if there is a user with the same email
    const foundUser = await User.findOne({ 'local.email': email });

    // Check if the entered email by user isn't already in the database
    if (foundUser) {
      return res.status(403).json({ error: 'Email is already in use' });
    }

    // Create a new user
    const newUser = new User({
      method: 'local',
      local: {
        email,
        firstName,
        lastName,
        password,
        birthDate,
        currentStatus,
        country,
        city,
        genre,
        zipCode,
        phoneNumber
      }
    });

    // Save the user
    const newUserSaved = await newUser.save((error) => {
      if (error) return res.status(500).json({ error });
      // Generating token
      const token = signToken(newUser);
      // Respond with token
      return res.status(201).json({ token });
    });
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error}`);
  }
};

// Sign in controller
const SignIn = async (req, res, next) => {
  try {
    // Generate token
    const token = signToken(req.user); // req.user came from local passport strategy middleware

    return res.status(200).json({ token, "id": req.user._id });
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error}`);
  }
};

// Forgot password controller
const ForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "local.email": email });

    if (!foundUser)
      return res
        .status(404)
        .json({ errorStatus: 404, errorMessage: "No email found" });

    return res.status(200).json({
      responseStatus: 200,
      responseMessage: "Reset password email was sent"
    });
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error}`);
  }
};

// GoogleOAuth controller
const GoogleOAuth = async (req, res, next) => {
  try {
    // Generate token
    const token = signToken(req.user); // req.user came from google passport strategy middleware

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error}`);
  }
};

const FacebookOAuth = async (req, res, next) => {
  try {
    // Generate token
    const token = signToken(req.user); // req.user came from facebook passport strategy middleware

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error}`);
  }
};

module.exports = {
  SignUp,
  SignUpFinal,
  SignIn,
  ForgotPassword,
  GoogleOAuth,
  FacebookOAuth
};
