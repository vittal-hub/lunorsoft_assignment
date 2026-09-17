const mongoose = require("mongoose");
const Task = require("../models/Task");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, subject, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      subject,
      priority,
      dueDate,
      user: req.userId,
    });

    res.status(201).json({ task });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Task could not be created" });
  }
};

// Get all tasks for the logged-in user, with optional search/filter
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, subject, search } = req.query;

    const query = { user: req.userId };

    if (status === "pending") query.completed = false;
    if (status === "completed") query.completed = true;

    if (priority && priority !== "All") {
      query.priority = priority;
    }

    if (subject && subject !== "All") {
      query.subject = subject;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// Get a single task belonging to the logged-in user
exports.getTaskById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// Update a task belonging to the logged-in user
exports.updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const { title, description, subject, priority, dueDate, completed } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (subject !== undefined) task.subject = subject;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (completed !== undefined) {
      task.completed = completed;
      task.completedAt = completed ? new Date() : null;
    }

    await task.save();

    res.status(200).json({ task });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Task could not be updated" });
  }
};

// Delete a task belonging to the logged-in user
exports.deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Task could not be deleted" });
  }
};
