const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Employee = require("./models/Employee");
const Attendance = require("./models/Attendance");
const Leave = require("./models/Leave");

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
};

const seedJuneData = async () => {
  try {
    await connectDB();

    const employees = await Employee.find({
      employeeId: {
        $in: ["EMP005", "EMP006", "EMP007", "EMP008", "EMP009"],
      },
    });

    if (employees.length === 0) {
      console.log("No employees found. Add EMP005 to EMP009 first.");
      process.exit();
    }

    await Attendance.deleteMany({
      employeeId: { $in: employees.map((e) => e._id) },
      date: { $regex: "^2026-06" },
    });

    await Leave.deleteMany({
      employeeId: { $in: employees.map((e) => e._id) },
      fromDate: {
        $gte: new Date("2026-06-01"),
        $lte: new Date("2026-06-30"),
      },
    });

    const attendanceData = [];

    employees.forEach((emp) => {
      for (let day = 1; day <= 20; day++) {
        const date = `2026-06-${String(day).padStart(2, "0")}`;

        attendanceData.push({
          employeeId: emp._id,
          date,
          checkIn: "09:15:00 AM",
          checkOut: "05:30:00 PM",
          workingHours: 8.25,
          status: "Present",
        });
      }
    });

    await Attendance.insertMany(attendanceData);

    const emp005 = employees.find((e) => e.employeeId === "EMP005");
    const emp006 = employees.find((e) => e.employeeId === "EMP006");
    const emp007 = employees.find((e) => e.employeeId === "EMP007");

    const leaveData = [];

    if (emp005) {
      leaveData.push({
        employeeId: emp005._id,
        leaveType: "Casual Leave",
        fromDate: new Date("2026-06-10"),
        toDate: new Date("2026-06-12"),
        totalDays: 3,
        paidDays: 3,
        lopDays: 0,
        reason: "Family function",
        status: "Approved",
        remarks: "Approved by HR",
      });
    }

    if (emp006) {
      leaveData.push({
        employeeId: emp006._id,
        leaveType: "Sick Leave",
        fromDate: new Date("2026-06-15"),
        toDate: new Date("2026-06-18"),
        totalDays: 4,
        paidDays: 2,
        lopDays: 2,
        reason: "Fever",
        status: "Approved",
        remarks: "2 days paid, 2 days LOP",
      });
    }

    if (emp007) {
      leaveData.push({
        employeeId: emp007._id,
        leaveType: "Casual Leave",
        fromDate: new Date("2026-06-20"),
        toDate: new Date("2026-06-25"),
        totalDays: 6,
        paidDays: 3,
        lopDays: 3,
        reason: "Personal work",
        status: "Approved",
        remarks: "3 days LOP applied",
      });
    }

    await Leave.insertMany(leaveData);

    console.log("June attendance and leave data inserted successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedJuneData();