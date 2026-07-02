const express = require("express");
const router = express.Router();

const {
  generatePayroll,
  getPayrolls,
  getMyPayslips,
  markPayrollPaid,
} = require("../controllers/payrollController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/my-payslips", protect, authorizeRoles("employee"), getMyPayslips);

router.post("/generate", protect, authorizeRoles("admin", "hr"), generatePayroll);

router.get("/", protect, authorizeRoles("admin", "hr"), getPayrolls);

router.put("/:id/paid", protect, authorizeRoles("admin", "hr"), markPayrollPaid);

module.exports = router;