const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { createTaskSchema, updateTaskSchema } = require("../validations/taskValidation");

router.use(protect);

router.route("/").get(getTasks).post(validate(createTaskSchema), createTask);
router
  .route("/:id")
  .get(getTaskById)
  .put(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

module.exports = router;
