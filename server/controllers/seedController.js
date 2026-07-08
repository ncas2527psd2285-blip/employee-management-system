const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

const getJuneWorkingDays = () => {
  const days = [];

  for (let d = 1; d <= 30; d++) {
    const date = new Date(`2026-06-${String(d).padStart(2, "0")}`);
    const day = date.getDay();

    if (day !== 0 && day !== 6) {
      days.push(`2026-06-${String(d).padStart(2, "0")}`);
    }
  }

  return days;
};

exports.seedJuneData = async (req, res) => {
  try {
    const employees = await Employee.find();

    if (employees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No employees found",
      });
    }

    await Attendance.deleteMany({
      date: { $regex: "^2026-06" },
    });

    await Leave.deleteMany({
      fromDate: {
        $gte: new Date("2026-06-01"),
        $lte: new Date("2026-06-30"),
      },
    });

    const workingDays = getJuneWorkingDays();
    const attendanceData = [];

    employees.forEach((emp) => {
      workingDays.forEach((date) => {
        attendanceData.push({
          employeeId: emp._id,
          date,
          checkIn: "09:15:00 AM",
          checkOut: "05:30:00 PM",
          workingHours: 8.25,
          status: "Present",
        });
      });
    });

    await Attendance.insertMany(attendanceData);

    const leaveData = [];

    if (employees[1]) {
      leaveData.push({
        employeeId: employees[1]._id,
        leaveType: "Sick Leave",
        fromDate: new Date("2026-06-10"),
        toDate: new Date("2026-06-13"),
        totalDays: 4,
        paidDays: 2,
        lopDays: 2,
        reason: "Fever",
        status: "Approved",
        remarks: "2 days LOP applied",
      });
    }

    if (employees[2]) {
      leaveData.push({
        employeeId: employees[2]._id,
        leaveType: "Casual Leave",
        fromDate: new Date("2026-06-20"),
        toDate: new Date("2026-06-25"),
        totalDays: 6,
        paidDays: 3,
        lopDays: 3,
        reason: "Personal work",
        status: "Approved",
        remarks: "3 days LOP applied",
      });
    }

    await Leave.insertMany(leaveData);

    res.json({
      success: true,
      message: "June demo attendance and leave data added successfully",
      employees: employees.length,
      attendanceRecords: attendanceData.length,
      leaveRecords: leaveData.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};