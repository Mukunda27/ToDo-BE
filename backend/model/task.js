const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  finishByDate: { type: String, required: true },
  finishByTime: { type: String, required: true },
  list: { type: String, required: false },
  important: { type: Boolean, required: true },
  completed: { type: Boolean, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
