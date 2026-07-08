const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const Employee = require("./models/Employee");
const User = require("./models/User");
const Attendance = require("./models/Attendance");
const Leave = require("./models/Leave");
const Payroll = require("./models/Payroll");

dotenv.config();

const employees = [
  ["EMP001", "Arun Kumar", "arun@gmail.com", "9876543201", "IT", "Software Developer", 35000],
  ["EMP002", "Priya Sharma", "priya@gmail.com", "9876543202", "HR", "HR Executive", 30000],
  ["EMP003", "Rahul Verma", "rahul@gmail.com", "9876543203", "Finance", "Accountant", 32000],
  ["EMP004", "Divya Ramesh", "divya@gmail.com", "9876543204", "Sales", "Sales Executive", 28000],
  ["EMP005", "Karthik Raj", "karthik@gmail.com", "9876543205", "IT", "Frontend Developer", 36000],
  ["EMP006", "Sneha Iyer", "sneha@gmail.com", "9876543206", "Marketing", "Marketing Executive", 29000],
  ["EMP007", "Vignesh Kumar", "vignesh@gmail.com", "9876543207", "Operations", "Operations Manager", 40000],
  ["EMP008", "Meena Devi", "meena@gmail.com", "9876543208", "Support", "Support Executive", 26000],
  ["EMP009", "Suresh Babu", "suresh@gmail.com", "9876543209", "Finance", "Finance Analyst", 38000],
  ["EMP010", "Anitha S", "anitha@gmail.com", "9876543210", "HR", "Recruiter", 31000],
  ["EMP011", "Naveen Raj", "naveen@gmail.com", "9876543211", "IT", "Backend Developer", 37000],
  ["EMP012", "Lakshmi Priya", "lakshmi@gmail.com", "9876543212", "Sales", "Sales Manager", 42000],
  ["EMP013", "Mohan Das", "mohan@gmail.com", "9876543213", "Support", "Technical Support", 27000],
  ["EMP014", "Keerthana M", "keerthana@gmail.com", "9876543214", "Marketing", "Content Executive", 30000],
  ["EMP015", "Balaji R", "balaji@gmail.com", "9876543215", "Operations", "Admin Officer", 33000],
];

const getWorkingDaysInJune = () => {
  const days = [];

  for (let day = 1; day <= 30; day++) {
    const date = new Date(`2026-06-${String(day).padStart(2, "0")}`);
    const weekDay = date.getDay();

    if (weekDay !== 0 && weekDay !== 6) {
      days.push(`2026-06-${String(day).padStart(2, "0")}`);
    }
  }

  return days;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const employeeIds = employees.map((emp) => emp[0]);
    const emails = employees.map((emp) => emp[2]);

    await Employee.deleteMany({ employeeId: { $in: employeeIds } });
    await User.deleteMany({ email: { $in: emails } });

    await Attendance.deleteMany({});
    await Leave.deleteMany({});
    await Payroll.deleteMany({});

    const hashedPassword = await bcrypt.hash("Welcome@123", 10);

    const createdEmployees = [];

    for (const emp of employees) {
      const [employeeId, name, email, phone, department, designation, salary] = emp;

      const employee = await Employee.create({
        employeeId,
        name,
        email,
        phone,
        department,
        designation,
        salary,
        joiningDate: new Date("2026-01-10"),
        status: "Active",
        gender: "Male",
        address: "Chennai, Tamil Nadu",
        emergencyContact: phone,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=2563eb&color=fff&size=256`,
      });

      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "employee",
      });

      createdEmployees.push(employee);
    }

    const workingDays = getWorkingDaysInJune();
    const attendanceData = [];

    for (const emp of createdEmployees) {
      for (const date of workingDays) {
        attendanceData.push({
          employeeId: emp._id,
          date,
          checkIn: "09:15:00 AM",
          checkOut: "05:30:00 PM",
          workingHours: 8.25,
          status: "Present",
        });
      }
    }

    await Attendance.insertMany(attendanceData);

    const leaveData = [
      {
        employeeId: createdEmployees[4]._id,
        leaveType: "Casual Leave",
        fromDate: new Date("2026-06-10"),
        toDate: new Date("2026-06-12"),
        totalDays: 3,
        paidDays: 3,
        lopDays: 0,
        reason: "Family function",
        status: "Approved",
        remarks: "Approved by HR",
      },
      {
        employeeId: createdEmployees[5]._id,
        leaveType: "Sick Leave",
        fromDate: new Date("2026-06-15"),
        toDate: new Date("2026-06-18"),
        totalDays: 4,
        paidDays: 2,
        lopDays: 2,
        reason: "Fever",
        status: "Approved",
        remarks: "2 days paid, 2 days LOP",
      },
      {
        employeeId: createdEmployees[6]._id,
        leaveType: "Casual Leave",
        fromDate: new Date("2026-06-22"),
        toDate: new Date("2026-06-26"),
        totalDays: 5,
        paidDays: 2,
        lopDays: 3,
        reason: "Personal work",
        status: "Approved",
        remarks: "3 days LOP applied",
      },
    ];

    await Leave.insertMany(leaveData);

    console.log("✅ 15 employees inserted");
    console.log("✅ Employee login created");
    console.log("✅ June attendance inserted");
    console.log("✅ June leave records inserted");
    console.log("Default employee password: Welcome@123");

    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();