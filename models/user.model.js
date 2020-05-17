const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// User schema
const userSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    password: {
      type: String
    },
    birthDate: {
      type: Number
    },
    currentStatus: {
      type: String,
      lowercase: true,
      enum: ["student", "worker", "unemployed"]
    },
    country: {
      type: String
    },
    city: {
      type: String
    },
    genre: {
      type: String,
      lowercase: true,
      enum: ["male", "female"]
    },
    zipCode: {
      type: String
    },
    phoneNumber: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }
});

// Executes before saving the document
userSchema.pre("save", async function (next) {
  try {
    // Check if user signed up with local strategy
    if (this.method !== "local") return next();

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password based on the generated salt
    const hash = await bcrypt.hash(this.local.password, salt);

    // Reassign the hash as the password
    this.local.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

// Check if the entered password matches with the one from the database
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Model
const User = mongoose.model("user", userSchema);

// Export
module.exports = User;
