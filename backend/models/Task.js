const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  // Free text so a custom subject (from the "Other" option) can be stored,
  // not just the predefined dropdown values
  subject: {
    type: String,
    trim: true,
    required: [true, "Subject is required"],
    default: "Other",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: [true, "Priority is required"],
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
