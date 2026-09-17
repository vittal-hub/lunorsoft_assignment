const express = require("express");
const router = express.Router();
const { register, login, logout, getMe } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validations/authValidation");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
