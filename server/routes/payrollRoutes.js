const express = require("express");
const router = express.Router();

const payrollController = require("../controllers/payrollController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");


// Generate payroll for all employees
router.post(
  "/generate-all",
  protect,
  authorizeRoles("Admin", "admin", "hr"),
  payrollController.generatePayrollForAll
);


// Generate single payroll
router.post(
  "/generate",
  protect,
  authorizeRoles("Admin", "admin", "hr"),
  payrollController.generatePayroll
);


// Get all payrolls
router.get(
  "/",
  protect,
  authorizeRoles("Admin", "admin", "hr"),
  payrollController.getPayrolls
);


// Mark payroll paid
router.put(
  "/:id/pay",
  protect,
  authorizeRoles("Admin", "admin", "hr"),
  payrollController.markPayrollPaid
);


// Employee payslips
router.get(
  "/my-payslips",
  protect,
  authorizeRoles("employee"),
  payrollController.getMyPayslips
);


module.exports = router;