const mongoose = require("mongoose");
const {
  ENUM_TASK_STATUS,
  STATUS,
  PRIORITY,
  ENUM_PRIORITY,
} = require("../utils/enums");
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    role: {
      type: String,
      enum: ENUM_TASK_STATUS,
      default: STATUS.PENDING,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ENUM_PRIORITY,
      default: PRIORITY.LOW,
    },
    assignee: {
      type: String,
      required: true,
    },
    completedAT: {
      type: Date,
    },
    comments: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("task", TaskSchema);
