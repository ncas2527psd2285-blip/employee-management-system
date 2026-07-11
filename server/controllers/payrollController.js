const Employee = require("../models/Employee");
const Payroll = require("../models/Payroll");
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
      otherDeductions = 0
    } = req.body;


    if (!employeeId || !month) {

      return res.status(400).json({
        success:false,
        message:"Employee and month are required"
      });

    }


    const employee = await Employee.findById(employeeId);


    if(!employee){

      return res.status(404).json({
        success:false,
        message:"Employee not found"
      });

    }



    const existingPayroll =
      await Payroll.findOne({
        employeeId,
        month
      });



    if(existingPayroll){

      return res.status(400).json({
        success:false,
        message:"Payroll already generated"
      });

    }



    const basicSalary =
      Number(employee.salary || 0);



    const grossSalary =
      basicSalary + Number(allowances);



    const totalDeductions =
      Number(pfDeduction) +
      Number(professionalTax) +
      Number(otherDeductions);



    const netSalary =
      grossSalary - totalDeductions;



    const payroll =
      await Payroll.create({

        employeeId,

        month,

        basicSalary,

        allowances:Number(allowances),

        grossSalary,

        leaveDetails:[],

        lopDays:0,

        lopDeduction:0,

        pfDeduction:Number(pfDeduction),

        professionalTax:Number(professionalTax),

        otherDeductions:Number(otherDeductions),

        totalDeductions,

        netSalary,

        status:"Generated"

      });



    res.json({

      success:true,

      message:"Payroll generated successfully",

      payroll

    });



  } catch(error){

    console.log(
      "GENERATE PAYROLL ERROR:",
      error
    );


    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};






// ============================
// Generate Payroll For All Employees
// ============================
exports.generatePayrollForAll = async (req,res)=>{


try{


const {
month,
allowances=0,
pfDeduction=0,
professionalTax=0,
otherDeductions=0
}=req.body;



if(!month){

return res.status(400).json({

success:false,

message:"Month is required"

});

}



const employees =
await Employee.find();



let generated=0;



for(const employee of employees){



const exists =
await Payroll.findOne({

employeeId:employee._id,

month

});



if(exists){

continue;

}



const basicSalary =
Number(employee.salary || 0);



const grossSalary =
basicSalary + Number(allowances);



const totalDeductions =
Number(pfDeduction) +
Number(professionalTax) +
Number(otherDeductions);



const netSalary =
grossSalary - totalDeductions;



await Payroll.create({


employeeId:employee._id,

month,

basicSalary,

allowances:Number(allowances),

grossSalary,

leaveDetails:[],

lopDays:0,

lopDeduction:0,

pfDeduction:Number(pfDeduction),

professionalTax:Number(professionalTax),

otherDeductions:Number(otherDeductions),

totalDeductions,

netSalary,

status:"Generated"


});



generated++;


}



res.json({

success:true,

message:`${generated} payroll(s) generated successfully`

});



}catch(error){


console.log(
"GENERATE ALL ERROR:",
error
);



res.status(500).json({

success:false,

message:error.message

});


}


};







// ============================
// Get All Payrolls
// ============================
exports.getPayrolls = async(req,res)=>{


try{


const payrolls =
await Payroll.find()

.populate(
"employeeId",
"employeeId name department designation"
)

.sort({
createdAt:-1
});



res.json({

success:true,

payrolls

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};







// ============================
// Mark Payroll Paid
// ============================
exports.markPayrollPaid = async(req,res)=>{


try{


const payroll =
await Payroll.findById(req.params.id);



if(!payroll){


return res.status(404).json({

success:false,

message:"Payroll not found"

});


}



payroll.status="Paid";


await payroll.save();



res.json({

success:true,

message:"Payroll marked as paid"

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};







// ============================
// Employee Payslips
// ============================
exports.getMyPayslips = async(req,res)=>{


try{


const payrolls =
await Payroll.find({

employeeId:req.user.id

})

.populate(
"employeeId",
"employeeId name"
);



res.json({

success:true,

payrolls

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};