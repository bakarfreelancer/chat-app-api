const express = require("express");
const router = new express.Router();

const User = require("../models/user");
const auth = require("../middleware/auth");

// REGISTER USER
router.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get("/login", async (req, res) => {
  try {
    const user = await User.findbyCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/profile", auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
