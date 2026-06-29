const express = require("express");
const router = express.Router();

const {
  generatePayroll,
  getPayrolls,
  getMyPayslips,
  markPayrollPaid,
} = require("../controllers/payrollController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Employee - View Own Payslips
router.get(
  "/my-payslips",
  protect,
  authorizeRoles("employee"),
  getMyPayslips
);

// Admin / HR - Generate Payroll
router.post(
  "/generate",
  protect,
  authorizeRoles("admin", "hr"),
  generatePayroll
);

// Admin / HR - View All Payrolls
router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getPayrolls
);

// Admin / HR - Mark Payroll as Paid
router.put(
  "/:id/paid",
  protect,
  authorizeRoles("admin", "hr"),
  markPayrollPaid
);

module.exports = router;