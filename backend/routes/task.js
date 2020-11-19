const express = require("express");
const router = express.Router();

const Task = require("../model/task");

router.post("/create", (req, res, next) => {
  if (
    !req.body.title ||
    !req.body.finishByDate ||
    req.body.important == null ||
    !req.body.finishByTime
  ) {
    return res
      .status(500)
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
  const taskQuery = Task.find({ creator: req.user._id }).sort({
    finishByDate: 1,
  });

  taskQuery
    .exec()
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

router.get("/day", (req, res, next) => {
  if (!req.query.date) {
    return res.status(500).json({
      message: "Some query parameters are missing in the request ",
    });
  }
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let totalTasks;

  const taskQuery = Task.find({
    creator: req.user._id,
    finishByDate: new Date(req.query.date).toLocaleDateString(),
  });

  taskQuery
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

  const taskQuery = Task.find({ creator: req.user._id, important: true }).sort({
    finishByDate: 1,
  });

  taskQuery
    .exec()
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
    return res.status(500).json({
      message: "Some query parameters are missing in the request ",
    });
  }

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let totalTasks;

  const taskQuery = Task.find({
    creator: req.user._id,
    list: req.query.list,
  }).sort({
    finishByDate: 1,
  });
  taskQuery
    .exec()
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
    return res.status(500).json({
      message: "Some parameters are missing in the request ",
    });
  }
  Task.findOneAndUpdate(
    { _id: req.params.id, creator: req.user._id },
    { $set: { completed: req.body.completed } }
  )
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
  Task.deleteOne({ _id: req.params.id, creator: req.user._id })
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
