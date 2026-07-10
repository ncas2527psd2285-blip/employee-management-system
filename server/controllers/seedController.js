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
  workingDays.forEach((date, index) => {

    let status = "Present";
    let checkIn = "09:05:00 AM";
    let checkOut = "05:35:00 PM";
    let workingHours = 8.5;

    // EMP003 - Late 3 times
    if (emp.employeeId === "EMP003" && [2, 8, 15].includes(index)) {
      status = "Late";
      checkIn = "09:35:00 AM";
      checkOut = "05:45:00 PM";
      workingHours = 8.1;
    }

    // EMP004 - Half Day twice
    if (emp.employeeId === "EMP004" && [6, 18].includes(index)) {
      status = "Half Day";
      checkIn = "09:00:00 AM";
      checkOut = "01:00:00 PM";
      workingHours = 4;
    }

    // EMP007 - Absent twice
    if (emp.employeeId === "EMP007" && [10, 20].includes(index)) {
      status = "Absent";
      checkIn = null;
      checkOut = null;
      workingHours = 0;
    }

    // EMP009 - Late 4 times
    if (emp.employeeId === "EMP009" && [3, 7, 14, 19].includes(index)) {
      status = "Late";
      checkIn = "09:40:00 AM";
      checkOut = "05:40:00 PM";
      workingHours = 8;
    }

    attendanceData.push({
      employeeId: emp._id,
      date,
      checkIn,
      checkOut,
      workingHours,
      status,
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