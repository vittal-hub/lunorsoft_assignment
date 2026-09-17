const { z } = require("zod");
const { SUBJECTS } = require("../constants");

const createTaskSchema = z.object({
  title: z.string({ error: "Title is required" }).trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  subject: z.enum(SUBJECTS, "Please select a valid subject"),
  priority: z.enum(["Low", "Medium", "High"], "Priority must be Low, Medium, or High"),
  dueDate: z.coerce.date("Due date must be a valid date"),
  completed: z.boolean().optional(),
});

// Update allows partial data since a user may only change one field (e.g. marking complete)
const updateTaskSchema = createTaskSchema.partial();

module.exports = { createTaskSchema, updateTaskSchema };
