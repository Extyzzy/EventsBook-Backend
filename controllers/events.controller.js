const Event = require("../models/event.model");
const User = require("../models/user.model");


// Create event
const CreateEvent = async (req, res, next) => {
  try {
    const {
      title,
      date,
      time,
      timeTill,
      category,
      country,
      city,
      address,
      created_by,
      price,
      currency,
      maxAmount,
      subscribed_users
    } = req.body;

    const thumbnail = `${req.file.filename}`;
    const description = JSON.parse(req.body.description);

    // Create a new user
    const createdEvent = new Event({
      title,
      description,
      thumbnail,
      date,
      time,
      time_till: timeTill,
      country,
      category,
      city,
      address,
      price,
      currency,
      max_amount_people: parseInt(maxAmount),
      current_amount_people: 0,
      subscribed_users,
      created_by
    });

    // Save the create event
    await createdEvent.save(error => {
      if (error) {
        console.log("Error on saving the temporary_user into the database ::", error);
        return res.status(500).json({ error });
      }

      return res.status(200).json({ message: "Event created with succes" });
    });
  } catch (error) {
    console.log('Error on creating an event ::', error);
    return res.status(500).send(`Internal server error: ${error}`);
  }
};

// Get event
const GetEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findOne({ _id: eventId });

    return res.status(200).json({ event });
  } catch (error) {
    console.log('Error on creating an event ::', error);
    return res.status(500).send(`Internal server error: ${error}`);
  }
};

// GetEvents
const GetEvents = async (req, res, next) => {
  try {
    const events = await Event.find();

    return res.status(200).json({ events });
  } catch (error) {
    console.log('Error on creating an event ::', error);
    return res.status(500).send(`Internal server error: ${error}`);
  }
};

module.exports = {
  CreateEvent,
  GetEvent,
  GetEvents
};