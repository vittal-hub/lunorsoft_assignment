const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Frontend (Netlify) and backend (Render) are on different domains, so the
// cookie needs SameSite=None to be sent on cross-site requests. SameSite=None
// requires Secure, which only works over HTTPS (i.e. in production).
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

// Create JWT and set it as an HTTP-only cookie
const sendTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    sendTokenCookie(res, user._id);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendTokenCookie(res, user._id);

    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

// Logout user
exports.logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
};

// Get currently logged-in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};
