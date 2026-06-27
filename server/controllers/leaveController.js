const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

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

    const leave = await Leave.create({
      employeeId,
      leaveType,
      fromDate,
      toDate,
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

// UPDATE LEAVE STATUS
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