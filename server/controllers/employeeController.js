const Employee = require("../models/Employee");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ===============================
// Add Employee + Create Login User
// ===============================
const addEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      status,
      gender,
      address,
      emergencyContact,
    } = req.body;

    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { employeeId }],
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee ID or Email already exists",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User account already exists with this email",
      });
    }

    const employee = await Employee.create({
      employeeId,
      name,
      email,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      status,
      gender,
      address,
      emergencyContact,
    });

    const defaultPassword = "Welcome@123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
    });

    res.status(201).json({
      success: true,
      message: "Employee Added Successfully. Login created with default password: Welcome@123",
      employee,
      defaultPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Employees
// ===============================
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get My Profile - Employee
// ===============================
const getMyEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Employee
// ===============================
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await User.findOneAndUpdate(
      { email: employee.email },
      {
        name: employee.name,
        email: employee.email,
      }
    );

    res.status(200).json({
      success: true,
      message: "Employee Updated Successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Employee + Login User
// ===============================
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await User.findOneAndDelete({ email: employee.email });

    res.status(200).json({
      success: true,
      message: "Employee and login account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  getMyEmployeeProfile,
  updateEmployee,
  deleteEmployee,
};