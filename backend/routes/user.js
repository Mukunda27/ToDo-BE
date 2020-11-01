const User = require("../model/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const tokenUtilities = require("../utilities/token");

router.post("/create", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: hash,
    });

    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User Created!!",
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let loggedInUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Incorrect Email or Password",
        });
      }
      loggedInUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Incorrect Email or Password",
        });
      }
      const authToken = tokenUtilities.generateAccessToken(loggedInUser._id);
      res.status(200).json({
        name: loggedInUser.name,
        userID: loggedInUser._id,
        token: `Bearer ${authToken}`,
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      res.status(401).json({
        message: "Something went wrong. Please try again",
        error: err,
      });
    });
});

router.get("/all", (req, res, next) => {
  getAllUsers()
    .then((users) => {
      console.log(users);
      res.status(200).json({
        users: users,
      });
    })
    .catch((err) => {
      res.status(401).json({
        message: "Could not get users",
        error: err,
      });
    });
});

const getAllUsers = async () => {
  let accountUsers = await User.find({}, "name _id");
  return accountUsers;
};

module.exports = router;
