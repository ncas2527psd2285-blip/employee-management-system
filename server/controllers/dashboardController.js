const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

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
  date: {
    $gte: todayStart,
    $lt: todayEnd,
  },
}).populate("employeeId");

const presentEmployees = [
  ...new Set(
    todayAttendance
      .filter((item) => item.checkIn)
      .map((item) => item.employeeId?._id.toString())
  ),
];

const presentToday = presentEmployees.length;

const absentToday = totalEmployees - presentToday;

    const lateToday = [
  ...new Set(
    todayAttendance
      .filter((item) => item.status === "Late")
      .map((item) => item.employeeId?._id.toString())
  ),
].length;


const halfDayToday = [
  ...new Set(
    todayAttendance
      .filter((item) => item.status === "Half Day")
      .map((item) => item.employeeId?._id.toString())
  ),
].length;

   const completedEmployees = [
  ...new Set(
    todayAttendance
      .filter((item) => item.checkIn && item.checkOut)
      .map((item) => item.employeeId?._id.toString())
  ),
];

const completedToday = completedEmployees.length;

    const pendingLeaves = await Leave.countDocuments({ status: "Pending" });
    const approvedLeaves = await Leave.countDocuments({ status: "Approved" });
    const rejectedLeaves = await Leave.countDocuments({ status: "Rejected" });

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
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
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