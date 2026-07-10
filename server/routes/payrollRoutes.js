const express = require("express");
const router = express.Router();

const {
  generatePayroll,
  generatePayrollForAll,
  getPayrolls,
  getMyPayslips,
  markPayrollPaid,
} = require("../controllers/payrollController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");


// Admin / HR - Generate payroll for all employees
router.post(
  "/generate-all",
  protect,
  authorizeRoles("Admin", "admin", "hr"),
  generatePayrollForAll
);


// Admin / HR - Generate single employee payroll
router.post(
  "/generate",
  protect,
  authorizeRoles("Admin", "admin", "hr"),
  generatePayroll
);


// Get all payrolls
router.get(
  "/",
  protect,
  authorizeRoles("Admin", "admin", "hr"),
  getPayrolls
);


// Mark payroll as paid
router.put(
  "/:id/pay",
  protect,
  authorizeRoles("Admin", "admin", "hr"),
  markPayrollPaid
);


// Employee payslips
router.get(
  "/my-payslips",
  protect,
  authorizeRoles("employee"),
  getMyPayslips
);


module.exports = router;