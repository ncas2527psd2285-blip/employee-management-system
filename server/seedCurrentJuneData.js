require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = require("./config/db");

const Employee = require("./models/Employee");
const Attendance = require("./models/Attendance");
const Leave = require("./models/Leave");

// June 2026 working days (Monday–Friday)
const getWorkingDays = () => {
  const days = [];

  const start = new Date("2026-06-01");
  const end = new Date("2026-06-30");

  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    const day = d.getDay();

    // Monday to Friday
    if (day !== 0 && day !== 6) {
      days.push(new Date(d));
    }
  }

  return days;
};

const lateEmployees = ["EMP003", "EMP009"];
const halfDayEmployees = ["EMP004"];
const absentEmployees = ["EMP007"];
const leaveEmployees = ["EMP002", "EMP005", "EMP010"];

const seedJuneData = async () => {
  try {
    await connectDB();

    console.log("Connected to MongoDB...");

    // Read all employees
    const employees = await Employee.find();

    if (employees.length === 0) {
      console.log("No employees found.");
      process.exit();
    }

    console.log(`Found ${employees.length} employees`);

    // Remove old June demo data
    await Attendance.deleteMany({
      date: {
        $gte: "2026-06-01",
        $lte: "2026-06-30",
      },
    });

    await Leave.deleteMany({
      fromDate: {
        $gte: new Date("2026-06-01"),
        $lte: new Date("2026-06-30"),
      },
    });

    const workingDays = getWorkingDays();

    const attendanceData = [];
    const leaveData = [];