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

// Admin / HR
router.post(
  "/generate",
  protect,
  authorizeRoles("admin", "hr"),
  generatePayroll
);

router.post(
  "/generate-all",
  protect,
  authorizeRoles("admin", "hr"),
  generatePayrollForAll
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getPayrolls
);

router.put(
  "/:id/pay",
  protect,
  authorizeRoles("admin", "hr"),
  markPayrollPaid
);

// Employee
router.get(
  "/my-payslips",
  protect,
  authorizeRoles("employee"),
  getMyPayslips
);

module.exports = router;