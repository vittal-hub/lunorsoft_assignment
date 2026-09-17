const { z } = require("zod");

const registerSchema = z.object({
  name: z.string({ error: "Name is required" }).trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email"),
  password: z.string({ error: "Password is required" }).min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});

module.exports = { registerSchema, loginSchema };
