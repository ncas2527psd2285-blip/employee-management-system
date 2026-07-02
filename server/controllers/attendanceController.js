const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

const getToday = () => new Date().toISOString().split("T")[0];

const convertTimeToSeconds = (time) => {
  if (!time) return 0;

  const [timePart, modifier] = time.split(" ");
  let [hours, minutes, seconds] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return hours * 3600 + minutes * 60 + seconds;
};

// Admin check-in
exports.checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = getToday();

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const existing = await Attendance.findOne({ employeeId, date: today });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already checked in today" });
    }

    const attendance = await Attendance.create({
      employeeId,
      date: today,
      checkIn: new Date().toLocaleTimeString(),
      checkOut: null,
      status: "Present",
    });

    res.json({ success: true, message: "Check In Successful", attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin check-out
exports.checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const attendance = await Attendance.findOne({
      employeeId,
      checkOut: null,
    }).sort({ createdAt: -1 });

    if (!attendance) {
      return res.status(404).json({ success: false, message: "No active check-in found" });
    }

    const checkOutTime = new Date().toLocaleTimeString();

    const inSeconds = convertTimeToSeconds(attendance.checkIn);
    const outSeconds = convertTimeToSeconds(checkOutTime);

    let diffSeconds = outSeconds - inSeconds;
    if (diffSeconds < 0) diffSeconds += 24 * 3600;

    const workingHours = diffSeconds / 3600;

    attendance.checkOut = checkOutTime;
    attendance.workingHours = Number(workingHours.toFixed(2));
    attendance.status = workingHours < 4 ? "Half Day" : "Present";

    await attendance.save();

    res.json({ success: true, message: "Check Out Successful", attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Employee self check-in
exports.myCheckIn = async (req, res) => {
  try {
    const today = getToday();

    const employee = await Employee.findOne({ email: req.user.email });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const existing = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today",
      });
    }

    const attendance = await Attendance.create({
      employeeId: employee._id,
      date: today,
      checkIn: new Date().toLocaleTimeString(),
      checkOut: null,
      status: "Present",
    });

    res.json({
      success: true,
      message: "Check In Successful",
      attendance,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Employee self check-out
exports.myCheckOut = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      checkOut: null,
    }).sort({ createdAt: -1 });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No active check-in found",
      });
    }

    const checkOutTime = new Date().toLocaleTimeString();

    const inSeconds = convertTimeToSeconds(attendance.checkIn);
    const outSeconds = convertTimeToSeconds(checkOutTime);

    let diffSeconds = outSeconds - inSeconds;
    if (diffSeconds < 0) diffSeconds += 24 * 3600;

    const workingHours = diffSeconds / 3600;

    attendance.checkOut = checkOutTime;
    attendance.workingHours = Number(workingHours.toFixed(2));
    attendance.status = workingHours < 4 ? "Half Day" : "Present";

    await attendance.save();

    res.json({
      success: true,
      message: "Check Out Successful",
      attendance,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employeeId", "employeeId name department designation")
      .sort({ createdAt: -1 });

    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAttendanceReport = async (req, res) => {
  try {
    const { date, department, status } = req.query;

    let filter = {};

    if (date) filter.date = date;
    if (status && status !== "All") filter.status = status;

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
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const attendance = await Attendance.find({ employeeId: employee._id })
      .populate("employeeId", "employeeId name department designation")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      attendance,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};