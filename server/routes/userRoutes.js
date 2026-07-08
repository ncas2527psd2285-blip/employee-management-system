const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  resetPassword,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", protect, authorizeRoles("admin", "hr"), getUsers);

router.post("/", protect, authorizeRoles("admin", "hr"), createUser);

router.put("/:id/reset-password", protect, authorizeRoles("admin", "hr"), resetPassword);

router.put("/:id/role", protect, authorizeRoles("admin"), updateUserRole);

router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;