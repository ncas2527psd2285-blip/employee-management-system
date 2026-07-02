const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

const getLeaveDays = (fromDate, toDate) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays > 0 ? diffDays : 1;
};

const getAnnualLimit = (leaveType) => {
  if (leaveType === "Casual Leave") return 12;
  if (leaveType === "Sick Leave") return 2;
  if (leaveType === "Maternity Leave") return 180;
  return 0;
};

// APPLY LEAVE
exports.applyLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, fromDate, toDate, reason } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const totalDays = getLeaveDays(fromDate, toDate);

    const leave = await Leave.create({
      employeeId,
      leaveType,
      fromDate,
      toDate,
      totalDays,
      paidDays: 0,
      lopDays: 0,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL LEAVES
exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employeeId", "employeeId name department designation")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET MY LEAVES
exports.getMyLeaves = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const leaves = await Leave.find({ employeeId: employee._id })
      .populate("employeeId", "employeeId name department designation")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE LEAVE STATUS WITH LOP CALCULATION
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (status === "Approved") {
      const year = new Date(leave.fromDate).getFullYear();

      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31);

      const annualLimit = getAnnualLimit(leave.leaveType);

      const approvedLeaves = await Leave.find({
        employeeId: leave.employeeId,
        leaveType: leave.leaveType,
        status: "Approved",
        _id: { $ne: leave._id },
        fromDate: { $gte: yearStart },
        toDate: { $lte: yearEnd },
      });

      const alreadyUsedPaidDays = approvedLeaves.reduce(
        (total, item) => total + Number(item.paidDays || 0),
        0
      );

      const availablePaidDays = Math.max(annualLimit - alreadyUsedPaidDays, 0);

      leave.paidDays = Math.min(leave.totalDays, availablePaidDays);
      leave.lopDays = Math.max(leave.totalDays - leave.paidDays, 0);
    }

    if (status === "Rejected") {
      leave.paidDays = 0;
      leave.lopDays = 0;
    }

    leave.status = status;
    leave.remarks = remarks || "";

    await leave.save();

    res.json({
      success: true,
      message: `Leave ${status} successfully`,
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};