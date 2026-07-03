const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");

exports.generatePayroll = async (req, res) => {
  try {
    const {
      employeeId,
      month,
      allowances,
      pfDeduction,
      professionalTax,
      otherDeductions,
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

    const lopDays = approvedLeaves.reduce(
      (total, leave) => total + Number(leave.lopDays || 0),
      0
    );
	const leaveDetails = approvedLeaves.map((leave) => ({
  leaveType: leave.leaveType,
  fromDate: leave.fromDate,
  toDate: leave.toDate,
  totalDays: leave.totalDays || 0,
  paidDays: leave.paidDays || 0,
  lopDays: leave.lopDays || 0,
  leaveDeduction: Number(leave.lopDays || 0) * 500,
}));

const lopDays = leaveDetails.reduce(
  (total, leave) => total + Number(leave.lopDays || 0),
  0
);

const leaveDeduction = leaveDetails.reduce(
  (total, leave) => total + Number(leave.leaveDeduction || 0),
  0
);

    const lopDeduction = leaveDeduction;

    const basicSalary = Number(employee.salary || 0);
    const allowanceAmount = Number(allowances || 0);
    const pfAmount = Number(pfDeduction || 0);
    const ptAmount = Number(professionalTax || 0);
    const otherAmount = Number(otherDeductions || 0);

    const grossSalary = basicSalary + allowanceAmount;

    const totalDeductions =
      lopDeduction + pfAmount + ptAmount + otherAmount;

    const netSalary = grossSalary - totalDeductions;

    const payroll = await Payroll.create({
      employeeId,
      month,
      basicSalary,
      allowances: allowanceAmount,
      grossSalary,
      lopDays,
      lopDeduction,
      pfDeduction: pfAmount,
      professionalTax: ptAmount,
      otherDeductions: otherAmount,
      totalDeductions,
      netSalary,
      status: "Generated",
	Payroll.create
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

exports.getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employeeId", "employeeId name department designation salary email")
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
      .populate("employeeId", "employeeId name department designation salary email")
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
      message: "Payroll marked as paid",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};