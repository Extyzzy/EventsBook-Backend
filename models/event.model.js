const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

// User schema
const eventSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: Array
  },
  thumbnail: {
    type: String
  },
  category: {
    type: String
  },
  date: {
    type: String
  },
  time: {
    type: String
  },
  time_till: {
    type: String
  },
  country: {
    type: String
  },
  city: {
    type: String
  },
  address: {
    type: String
  },
  created_by: {
    type: String
  },
  price: {
    type: Number
  },
  currency: {
    type: String
  },
  max_amount_people: {
    type: Number
  },
  current_amount_people: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Number
  },
  subscribed_users: {
    type: Array
  }
});

// Executes before saving the document
eventSchema.pre("save", async function (next) {
  try {
    this.created_at = moment().unix();

    return next();
  } catch (error) {
    return next(error);
  }
});

// Model
const Event = mongoose.model("event", eventSchema);

// Export
module.exports = Event;
