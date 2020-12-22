const express = require("express");
const router = express.Router();

const User = require("../model/user");

router.get("/all-friends", (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate({ path: "friends", select: "name email" })
    .exec()
    .then((result) => {
      res.status(200).json({
        friends: result.friends,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/requests", (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate({ path: "requests", select: "name email" })
    .exec()
    .then((result) => {
      res.status(200).json({
        requests: result.requests,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/sent-requests", (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate({ path: "sentRequests", select: "name email" })
    .exec()
    .then((result) => {
      res.status(200).json({
        sentRequests: result.sentRequests,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/discover", (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      return User.find({
        _id: { $ne: user._id },
      });
      // return User.find({
      //   _id: { $ne: user._id, $nin: user.friends, $nin: user.requests },
      //   requests: { $ne: user._id },
      //   friends: { $ne: user._id },
      // });
    })
    .then((allUsers) => {
      res.status(200).json({
        users: allUsers,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.post("/send-request", (req, res, next) => {
  if (!req.body.requestedId) {
    return res
      .status(400)
      .json({ message: "Some parameters are missing in the request body" });
  }

  User.findOneAndUpdate(
    { _id: req.body.requestedId, requests: { $ne: req.user._id } },
    { $push: { requests: req.user._id } }
  )
    .then((result) => {
      return User.findOneAndUpdate(
        { _id: req.user._id, sentRequests: { $ne: req.body.requestedId } },
        {
          $push: { sentRequests: req.body.requestedId },
        }
      );
    })
    .then((result) => {
      res.status(200).json({
        message: "Request sent successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.post("/accept-request", (req, res, next) => {
  if (!req.body.requestedId) {
    return res
      .status(400)
      .json({ message: "Some parameters are missing in the request body" });
  }

  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: { friends: req.body.requestedId },
      $pull: {
        requests: req.body.requestedId,
        sentRequests: req.body.requestedId,
      },
    }
  )
    .then((result) => {
      return User.findOneAndUpdate(
        { _id: req.body.requestedId },
        {
          $push: { friends: req.user._id },
          $pull: { sentRequests: req.user._id, requests: req.user._id },
        }
      );
    })
    .then((result) => {
      res.status(200).json({
        message: "Request accepted successfully",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

router.post("/reject-request", (req, res, next) => {
  if (!req.body.requestedId) {
    return res
      .status(400)
      .json({ message: "Some parameters are missing in the request body" });
  }

  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { requests: req.body.requestedId },
    }
  )
    .then((result) => {
      return User.findOneAndUpdate(
        { _id: req.body.requestedId },
        {
          $pull: { sentRequests: req.user._id },
        }
      );
    })
    .then((result) => {
      res.status(200).json({
        message: "Request reject complete",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.post("/remove-friend", (req, res, next) => {
  if (!req.body.requestedId) {
    return res
      .status(400)
      .json({ message: "Some parameters are missing in the request body" });
  }

  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { friends: req.body.requestedId },
    }
  )
    .then((result) => {
      return User.findOneAndUpdate(
        { _id: req.body.requestedId },
        {
          $pull: { friends: req.user._id },
        }
      );
    })
    .then((result) => {
      res.status(200).json({
        message: "Removed friemd successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

module.exports = router;
