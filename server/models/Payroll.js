const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    month: {
      type: String,
      required: true,
    },

    basicSalary: {
      type: Number,
      required: true,
    },

    allowances: {
      type: Number,
      default: 0,
    },

    grossSalary: {
      type: Number,
      default: 0,
    },

    lopDays: {
      type: Number,
      default: 0,
    },

    lopDeduction: {
      type: Number,
      default: 0,
    },

    pfDeduction: {
      type: Number,
      default: 0,
    },

    professionalTax: {
      type: Number,
      default: 0,
    },

    otherDeductions: {
      type: Number,
      default: 0,
    },

    totalDeductions: {
      type: Number,
      default: 0,
    },

    netSalary: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Generated", "Paid"],
      default: "Generated",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payroll", payrollSchema);