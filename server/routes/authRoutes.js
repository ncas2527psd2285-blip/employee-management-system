const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route
router.put("/change-password", protect, changePassword);

module.exports = router;