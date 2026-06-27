const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Convert time like "9:40:04 PM" into seconds
const convertTimeToSeconds = (time) => {
  if (!time) return 0;

  const [timePart, modifier] = time.split(" ");
  let [hours, minutes, seconds] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 3600 + minutes * 60 + seconds;
};

// =============================
// CHECK IN
// =============================
exports.checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const today = new Date().toISOString().split("T")[0];

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const existing = await Attendance.findOne({ employeeId, date: today });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today",
      });
    }

    const attendance = await Attendance.create({
      employeeId,
      date: today,
      checkIn: new Date().toLocaleTimeString(),
      status: "Present",
    });

    res.json({
      success: true,
      message: "Check In Successful",
      attendance,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =============================
// CHECK OUT
// =============================
exports.checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;

   const attendance = await Attendance.findOne({
  employeeId,
  checkOut: null,
}).sort({ createdAt: -1 });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No check-in found for today",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "Already checked out today",
      });
    }

    const checkOutTime = new Date().toLocaleTimeString();

    const inSeconds = convertTimeToSeconds(attendance.checkIn);
    const outSeconds = convertTimeToSeconds(checkOutTime);

    let diffSeconds = outSeconds - inSeconds;

    if (diffSeconds < 0) {
      diffSeconds += 24 * 3600;
    }

    const workingHours = diffSeconds / 3600;

    attendance.checkOut = checkOutTime;
    attendance.workingHours = Number(workingHours.toFixed(2));

    if (workingHours < 4) {
      attendance.status = "Half Day";
    } else {
      attendance.status = "Present";
    }

    await attendance.save();

    res.json({
      success: true,
      message: "Check Out Successful",
      attendance,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =============================
// GET ATTENDANCE
// =============================
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employeeId", "employeeId name department designation")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      attendance,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =============================
// GET ATTENDANCE REPORT
// =============================
exports.getAttendanceReport = async (req, res) => {
  try {
    const { date, department, status } = req.query;

    let filter = {};

    if (date) {
      filter.date = date;
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    let attendance = await Attendance.find(filter)
      .populate("employeeId", "employeeId name department designation")
      .sort({ createdAt: -1 });

    if (department && department !== "All") {
      attendance = attendance.filter(
        (item) => item.employeeId?.department === department
      );
    }

    res.json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};