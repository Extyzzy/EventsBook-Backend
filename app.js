const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const config = require("./config");

// Initialize the app
const app = express();

// Database connection
mongoose.connect(
  "mongodb://localhost:27017/eventsbook-v2",
  { useNewUrlParser: true },
  () => console.log("Connected to MongoDB")
);

// Database connection throws an error
mongoose.connection.on('error', err => console.log('Mongoose default connection error: ' + err));

// Database connection is disconnected
mongoose.connection.on('disconnected', () => console.log('Mongoose default connection disconnected'));

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/users.route"));
app.use("/api/events", require("./routes/events.route"));
// app.use("api/articles", require("./routes/articles"));

// Listening to the server
const port = config.PORT || 5001;

app.listen(port, () => console.log(`Listening on port ${port}`));
