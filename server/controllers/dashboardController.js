const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");

const getDashboardStats = async (req, res) => {
  try {
    const todayDate = new Date();

const todayStart = new Date(
  todayDate.getFullYear(),
  todayDate.getMonth(),
  todayDate.getDate()
);

const todayEnd = new Date(
  todayDate.getFullYear(),
  todayDate.getMonth(),
  todayDate.getDate() + 1
);

    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: "Active" });

   const todayAttendance = await Attendance.find({
  createdAt: {
    $gte: todayStart,
    $lt: todayEnd,
  },
}).populate("employeeId");

    const presentToday = todayAttendance.length;
    const absentToday = totalEmployees - presentToday;

    const lateToday = todayAttendance.filter(
      (item) => item.status === "Late"
    ).length;

    const halfDayToday = todayAttendance.filter(
      (item) => item.status === "Half Day"
    ).length;

    const completedToday = todayAttendance.filter(
      (item) => item.checkIn && item.checkOut
    ).length;

    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const recentAttendance = todayAttendance
      .slice(-5)
      .reverse()
      .map((item) => ({
        employeeId: item.employeeId?.employeeId,
        name: item.employeeId?.name,
        department: item.employeeId?.department,
        checkIn: item.checkIn,
        checkOut: item.checkOut,
        status: item.status,
        workingHours: item.workingHours,
      }));

    const totalWorkingHours = todayAttendance.reduce(
      (sum, item) => sum + (item.workingHours || 0),
      0
    );

    const averageWorkingHours =
      todayAttendance.length > 0
        ? (totalWorkingHours / todayAttendance.length).toFixed(2)
        : 0;

    res.json({
      success: true,
      totalEmployees,
      activeEmployees,
      presentToday,
      absentToday,
      lateToday,
      halfDayToday,
      completedToday,
      departmentStats,
      recentAttendance,
      averageWorkingHours: `${averageWorkingHours} hrs`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Dashboard stats failed",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};