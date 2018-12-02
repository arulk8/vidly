const { Users, validateUser } = require("../models/usersModel");
const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const router = express.Router();
router.get("/me", auth, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select({
      name: 1,
      email: 1
    });
    res.send(user);
    return false;
  } catch (err) {
    res.status(500).send(`some error occured ${err.message}`);
  }
});
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message); // bad request
    return false;
  }
  try {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
      res.status(409).send("You are already an registerd user !!!");
      return false;
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: passwordHash
    });
    user = await user.save();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({ id: user._id, name: user.name, email: user.email });
    return false;
  } catch (err) {
    res.status(500).send(`error occured please try again ${err.message}`);
    return false;
  }
});

module.exports = router;
