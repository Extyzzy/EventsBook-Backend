const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const ExtractJwt = require("passport-jwt").ExtractJwt;

const { JWT_SECRET, GOOGLE, FACEBOOK } = require("./config");
const User = require("./models/user.model");

// JSON WEB TOKENS Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        // Find the user's specified in token
        const foundUser = await User.findById(payload.sub);

        // If user doesn't exist
        if (!foundUser) return done(null, false);

        // Return the user
        done(null, foundUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// LOCAL Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        // Find the user given the email
        const foundUser = await User.findOne({ "local.email": email });

        // If user doesn't exist
        if (!foundUser) return done(null, false);

        // Check if the password is correct
        const isValid = await foundUser.isValidPassword(password);

        // Incorrect password
        if (!isValid) return done(null, false);

        // Return the user
        return done(null, foundUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// GOOGLE OAUTH Strategy
passport.use(
  "googleToken",
  new GooglePlusTokenStrategy(
    {
      clientID: GOOGLE.clientID,
      clientSecret: GOOGLE.clientSecret
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exist in the database
        const foundUser = await User.findOne({ "google.id": profile.id });

        // Return existing user
        if (foundUser) {
          return done(null, foundUser);
        }

        // If the user is a new one
        const newUser = new User({
          method: "google",
          google: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });

        await newUser.save(error => {
          if (error) return done(error, false);
        });

        // Return newly created user
        return done(null, newUser);
      } catch (error) {
        return done(error, false, error.message);
      }
    }
  )
);

// FACEBOOK OAUTH Strategy
passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: FACEBOOK.clientID,
      clientSecret: FACEBOOK.clientSecret
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exist in the database
        const foundUser = await User.findOne({ "facebook.id": profile.id });

        // Return existing user
        if (foundUser) {
          return done(null, foundUser);
        }

        // If the user is a new one
        const newUser = new User({
          method: "facebook",
          facebook: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });

        await newUser.save(error => {
          if (error) return done(error, false);
        });

        // Return newly created user
        return done(null, newUser);
      } catch (error) {
        return done(error, false, error.message);
      }
    }
  )
);
