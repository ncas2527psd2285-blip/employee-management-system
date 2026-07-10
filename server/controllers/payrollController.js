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


    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month is required",
      });
    }


    const employees = await Employee.find();

    let generated = 0;


    for (const employee of employees) {

      // Check existing payroll
      const exists = await Payroll.findOne({
        employeeId: employee._id,
        month,
      });


      if (exists) {
        continue;
      }


      const [year, monthNumber] = month.split("-");


      const startDate = new Date(
        Number(year),
        Number(monthNumber) - 1,
        1
      );


      const endDate = new Date(
        Number(year),
        Number(monthNumber),
        0
      );


      // Approved leaves
      const approvedLeaves = await Leave.find({
        employeeId: employee._id,
        status: "Approved",
        fromDate: { $lte: endDate },
        toDate: { $gte: startDate },
      });



      const absentDays = await Attendance.countDocuments({
        employeeId: employee._id,
        date: {
          $regex: `^${month}`,
        },
        status: "Absent",
      });



      const leaveDetails = approvedLeaves.map((leave) => ({
        leaveType: leave.leaveType,
        fromDate: leave.fromDate,
        toDate: leave.toDate,
        totalDays: leave.totalDays || 0,
        paidDays: leave.paidDays || 0,
        lopDays: leave.lopDays || 0,
        leaveDeduction: 0,
      }));



      const leaveLOP = leaveDetails.reduce(
        (sum, item) =>
          sum + Number(item.lopDays || 0),
        0
      );



      const totalLOP =
        Number(leaveLOP || 0) +
        Number(absentDays || 0);



      const basicSalary =
        Number(employee.salary || 0);



      const dailySalary =
        basicSalary / 30;



      const lopDeduction =
        dailySalary * totalLOP;



      const grossSalary =
        basicSalary +
        Number(allowances || 0);



      const totalDeductions =
        Number(lopDeduction || 0) +
        Number(pfDeduction || 0) +
        Number(professionalTax || 0) +
        Number(otherDeductions || 0);



      const netSalary =
        grossSalary - totalDeductions;



      await Payroll.create({

        employeeId: employee._id,

        month,

        basicSalary,

        allowances: Number(allowances || 0),

        grossSalary,

        leaveDetails,

        lopDays: totalLOP,

        lopDeduction,

        pfDeduction: Number(pfDeduction || 0),

        professionalTax: Number(professionalTax || 0),

        otherDeductions: Number(otherDeductions || 0),

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


    console.log(
      "GENERATE ALL PAYROLL ERROR:",
      error
    );


    res.status(500).json({

      success:false,

      message:error.message,

    });


  }
};