const express = require("express");
const router = express.Router();

const Task = require("../model/task");
const User = require("../model/user");

router.post("/create", (req, res, next) => {
  console.log(req.body);
  if (
    !req.body.title ||
    !req.body.finishByDate ||
    req.body.important == null ||
    !req.body.finishByTime
  ) {
    return res
      .status(400)
      .json({ message: "Some parameters are missing in the request body" });
  }

  const task = new Task({
    title: req.body.title,
    finishByDate: req.body.finishByDate,
    finishByTime: req.body.finishByTime,
    important: req.body.important,
    completed: false,
    creator: req.user._id,
  });

  if (req.body.list) {
    task.list = req.body.list;
  }

  task
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Task Created!!",
        task: result,
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
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let totalTasks;
  let taskQuery;

  User.findOne({ _id: req.user._id })
    .then((user) => {
      taskQuery = Task.find({
        $or: [{ creator: req.user._id }, { creator: { $in: user.friends } }],
      })
        .sort({
          finishByDate: 1,
        })
        .populate({ path: "creator", select: "name" });
      return taskQuery.exec();
    })
    .then((result) => {
      totalTasks = result.length;
      if (!pageSize || !currentPage) {
        res.status(200).json({
          tasks: result,
          totalTasks: totalTasks,
        });
      }
      return taskQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    })
    .then((result) => {
      res.status(200).json({
        tasks: result,
        totalTasks: totalTasks,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/day", (req, res, next) => {
  if (!req.query.date) {
    return res.status(400).json({
      message: "Some query parameters are missing in the request ",
    });
  }
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let totalTasks;
  let taskQuery;

  User.findOne({ _id: req.user._id })
    .then((user) => {
      taskQuery = Task.find({
        $or: [{ creator: req.user._id }, { creator: { $in: user.friends } }],
        finishByDate: new Date(req.query.date).toLocaleDateString(),
      }).populate({ path: "creator", select: "name" });
      return taskQuery.exec();
    })
    .then((result) => {
      totalTasks = result.length;
      if (!pageSize || !currentPage) {
        res.status(200).json({
          tasks: result,
          totalTasks: totalTasks,
        });
      }
      return taskQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    })
    .then((result) => {
      res.status(200).json({
        tasks: result,
        totalTasks: totalTasks,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/important", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let totalTasks;
  let taskQuery;

  User.findOne({ _id: req.user._id })
    .then((user) => {
      taskQuery = Task.find({
        $or: [{ creator: req.user._id }, { creator: { $in: user.friends } }],
        important: true,
      })
        .sort({
          finishByDate: 1,
        })
        .populate({ path: "creator", select: "name" });
      return taskQuery.exec();
    })
    .then((result) => {
      totalTasks = result.length;
      if (!pageSize || !currentPage) {
        res.status(200).json({
          tasks: result,
          totalTasks: totalTasks,
        });
      }
      return taskQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    })
    .then((result) => {
      res.status(200).json({
        tasks: result,
        totalTasks: totalTasks,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/list", (req, res, next) => {
  if (!req.query.list) {
    return res.status(400).json({
      message: "Some query parameters are missing in the request ",
    });
  }

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let totalTasks;
  let taskQuery;

  User.findOne({ _id: req.user._id })
    .then((user) => {
      taskQuery = Task.find({
        $or: [{ creator: req.user._id }, { creator: { $in: user.friends } }],
        list: req.query.list,
      })
        .sort({
          finishByDate: 1,
        })
        .populate({ path: "creator", select: "name" });
      return taskQuery.exec();
    })
    .then((result) => {
      totalTasks = result.length;
      if (!pageSize || !currentPage) {
        res.status(200).json({
          tasks: result,
          totalTasks: totalTasks,
        });
      }
      return taskQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    })
    .then((result) => {
      res.status(200).json({
        tasks: result,
        totalTasks: totalTasks,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.put("/:id", (req, res, next) => {
  if (req.body.completed == null) {
    return res.status(400).json({
      message: "Some parameters are missing in the request ",
    });
  }

  User.findOne({ _id: req.user._id })
    .then((user) => {
      return Task.findOneAndUpdate(
        {
          _id: req.params.id,
          $or: [{ creator: req.user._id }, { creator: { $in: user.friends } }],
        },
        { $set: { completed: req.body.completed } }
      );
    })
    .then((result) => {
      res.status(200).json({ message: "Task status change successful!" });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      return Task.deleteOne({
        _id: req.params.id,
        $or: [{ creator: req.user._id }, { creator: { $in: user.friends } }],
      });
    })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

module.exports = router;
