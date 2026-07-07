const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: Number,
      required: true,
      min: 0,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },

    address: {
      type: String,
      default: "",
    },

    emergencyContact: {
      type: String,
      default: "",
    },

    // Employee profile photo URL (Cloudinary)
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);