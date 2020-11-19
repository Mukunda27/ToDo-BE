const express = require("express");
const router = express.Router();

const List = require("../model/list");

router.post("/add", (req, res, next) => {
  if (!req.body.listName) {
    return res
      .status(500)
      .json({ message: "List Name is missing in the request body" });
  }

  const list = new List({
    name: req.body.listName,
    creator: req.user._id,
  });

  list
    .save()
    .then((result) => {
      res.status(201).json({
        message: "List Added!!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/all", (req, res, next) => {
  List.find({ creator: req.user._id }, "name")
    .then((result) => {
      res.status(200).json({
        lists: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
