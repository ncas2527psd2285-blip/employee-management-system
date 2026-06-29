const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");

exports.generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, allowances, deductions } = req.body;

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

    const basicSalary = employee.salary;
    const netSalary =
      Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

    const payroll = await Payroll.create({
      employeeId,
      month,
      basicSalary,
      allowances,
      deductions,
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

exports.getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employeeId", "employeeId name department designation salary")
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
      .populate("employeeId", "employeeId name department designation salary")
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