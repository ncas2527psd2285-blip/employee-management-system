const express = require("express");
const router = express.Router();

const {
  checkIn,
  checkOut,
  getAttendance,
  getAttendanceReport,
} = require("../controllers/attendanceController");
// =========================
// ROUTES
// =========================

router.get("/", getAttendance);
router.post("/checkin", checkIn);
router.post("/checkout", checkOut);
router.get("/report", getAttendanceReport);

module.exports = router;