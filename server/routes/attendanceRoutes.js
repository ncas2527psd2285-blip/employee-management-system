const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get(
  "/my-attendance",
  protect,
  authorizeRoles("employee"),
  attendanceController.getMyAttendance
);

router.post(
  "/my-checkin",
  protect,
  authorizeRoles("employee"),
  attendanceController.myCheckIn
);

router.post(
  "/my-checkout",
  protect,
  authorizeRoles("employee"),
  attendanceController.myCheckOut
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  attendanceController.getAttendance
);

router.post(
  "/checkin",
  protect,
  authorizeRoles("admin", "hr"),
  attendanceController.checkIn
);

router.post(
  "/checkout",
  protect,
  authorizeRoles("admin", "hr"),
  attendanceController.checkOut
);

router.get(
  "/report",
  protect,
  authorizeRoles("admin", "hr"),
  attendanceController.getAttendanceReport
);

module.exports = router;