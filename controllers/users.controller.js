const User = require("../models/user.model");

const GetUser = async (req, res, ext) => {
  try {
    const { id } = req.params;
    console.log("hereer", id);

    const foundUser = await User.findById(id);

    if (!foundUser) return res.status(404).json({ error: "User not found" });
    let user;

    if (foundUser.method === "local") {
      user = {
        email: foundUser.local.email,
        firstName: foundUser.local.firstName,
        lastName: foundUser.local.lastName
      };
    } else if (foundUser.method === "google") {
      user = { email: foundUser.google.email };
    } else if (foundUser.method === "facebook") {
      user = { email: foundUser.facebook.email };
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error}`);
  }
};

module.exports = {
  GetUser
};
