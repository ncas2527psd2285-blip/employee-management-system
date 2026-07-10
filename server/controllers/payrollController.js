const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");

// ============================
// Generate Payroll (Single Employee)
// ============================
exports.generatePayroll = async (req, res) => {
  try {
    const {
      employeeId,
      month,
      allowances = 0,
      pfDeduction = 0,
      professionalTax = 0,
      otherDeductions = 0,
    } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const existing = await Payroll.findOne({ employeeId, month });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Payroll already generated for this month",
      });
    }

    const [year, monthNumber] = month.split("-");

    const startDate = new Date(Number(year), Number(monthNumber) - 1, 1);
    const endDate = new Date(Number(year), Number(monthNumber), 0);

    const approvedLeaves = await Leave.find({
      employeeId,
      status: "Approved",
      fromDate: { $lte: endDate },
      toDate: { $gte: startDate },
    });

    const absentDays = await Attendance.countDocuments({
      employeeId,
      date: { $regex: `^${month}` },
      status: "Absent",
    });

    const leaveDetails = approvedLeaves.map((leave) => ({
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      totalDays: leave.totalDays,
      paidDays: leave.paidDays,
      lopDays: leave.lopDays,
      leaveDeduction: 0,
    }));

    const leaveLOP = leaveDetails.reduce(
      (sum, item) => sum + Number(item.lopDays),
      0
    );

    const totalLOP = leaveLOP + absentDays;

    const basicSalary = Number(employee.salary);

    const dailySalary = basicSalary / 30;

    const lopDeduction = dailySalary * totalLOP;

    const grossSalary = basicSalary + Number(allowances);

    const totalDeductions =
      lopDeduction +
      Number(pfDeduction) +
      Number(professionalTax) +
      Number(otherDeductions);

    const netSalary = grossSalary - totalDeductions;

    const payroll = await Payroll.create({
      employeeId,
      month,
      basicSalary,
      allowances,
      grossSalary,
      leaveDetails,
      lopDays: totalLOP,
      lopDeduction,
      pfDeduction,
      professionalTax,
      otherDeductions,
      totalDeductions,
      netSalary,
      status: "Generated",
    });

    res.status(201).json({
      success: true,
      message: "Payroll generated successfully",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Generate Payroll (All Employees)
// ============================
exports.generatePayrollForAll = async (req, res) => {
  try {
    const {
      month,
      allowances = 0,
      pfDeduction = 0,
      professionalTax = 0,
      otherDeductions = 0,
    } = req.body;

    const employees = await Employee.find();

    let generated = 0;

    for (const employee of employees) {
      const exists = await Payroll.findOne({
        employeeId: employee._id,
        month,
      });

      if (exists) continue;

      const [year, monthNumber] = month.split("-");

      const startDate = new Date(Number(year), Number(monthNumber) - 1, 1);
      const endDate = new Date(Number(year), Number(monthNumber), 0);

      const approvedLeaves = await Leave.find({
        employeeId: employee._id,
        status: "Approved",
        fromDate: { $lte: endDate },
        toDate: { $gte: startDate },
      });

      const absentDays = await Attendance.countDocuments({
        employeeId: employee._id,
        date: { $regex: `^${month}` },
        status: "Absent",
      });

      const leaveDetails = approvedLeaves.map((leave) => ({
        leaveType: leave.leaveType,
        fromDate: leave.fromDate,
        toDate: leave.toDate,
        totalDays: leave.totalDays,
        paidDays: leave.paidDays,
        lopDays: leave.lopDays,
        leaveDeduction: 0,
      }));

      const leaveLOP = leaveDetails.reduce(
        (sum, item) => sum + Number(item.lopDays),
        0
      );

      const totalLOP = leaveLOP + absentDays;

      const basicSalary = Number(employee.salary);

      const dailySalary = basicSalary / 30;

      const lopDeduction = dailySalary * totalLOP;

      const grossSalary = basicSalary + Number(allowances);

      const totalDeductions =
        lopDeduction +
        Number(pfDeduction) +
        Number(professionalTax) +
        Number(otherDeductions);

      const netSalary = grossSalary - totalDeductions;

      await Payroll.create({
        employeeId: employee._id,
        month,
        basicSalary,
        allowances,
        grossSalary,
        leaveDetails,
        lopDays: totalLOP,
        lopDeduction,
        pfDeduction,
        professionalTax,
        otherDeductions,
        totalDeductions,
        netSalary,
        status: "Generated",
      });

      generated++;
    }

    res.json({
      success: true,
      message: `${generated} payroll(s) generated successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Get All Payrolls
// ============================
exports.getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate(
        "employeeId",
        "employeeId name department designation salary email"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payrolls.length,
      payrolls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Employee Payslips
// ============================
exports.getMyPayslips = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const payrolls = await Payroll.find({ employeeId: employee._id })
      .populate(
        "employeeId",
        "employeeId name department designation salary email"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payrolls.length,
      payrolls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Mark Payroll Paid
// ============================
exports.markPayrollPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    payroll.status = "Paid";

    await payroll.save();

    res.json({
      success: true,
      message: "Payroll marked as Paid",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};