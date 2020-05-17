const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

// User schema
const temporaryUserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  confirmationKey: {
    type: String,
    required: true
  },
  date: {
    type: Number
  },
  expireDate: {
    type: Number
  }
});

// Executes before saving the document
temporaryUserSchema.pre("save", async function (next) {
  try {
    // Save the date when user registered
    const date = moment().unix();

    this.date = date;
    // this.expireDate = date.add('days', 1);
    this.expireDate = date;

    return next();
  } catch (error) {
    return next(error);
  }
});

// Check if the entered password matches with the one from the database
temporaryUserSchema.methods.isExpired = async function () {
  try {
    return this.expireDate > moment();
  } catch (error) {
    throw new Error(error);
  }
};

// Model
const temporaryUser = mongoose.model("temporary_user", temporaryUserSchema);

// Export
module.exports = temporaryUser;
