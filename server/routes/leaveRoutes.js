const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getLeaves,
  getMyLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/my-leaves", protect, authorizeRoles("employee"), getMyLeaves);

router.post(
  "/apply",
  protect,
  authorizeRoles("admin", "hr", "employee"),
  applyLeave
);

router.get("/", protect, authorizeRoles("admin", "hr"), getLeaves);

router.put("/:id", protect, authorizeRoles("admin", "hr"), updateLeaveStatus);

module.exports = router;