const express = require("express");
const router = express.Router();

const {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create Employee - Admin and HR
router.post("/", protect, authorizeRoles("admin", "hr"), addEmployee);

// Get All Employees - Admin and HR
router.get("/", protect, authorizeRoles("admin", "hr"), getEmployees);

// Update Employee - Admin and HR
router.put("/:id", protect, authorizeRoles("admin", "hr"), updateEmployee);

// Delete Employee - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteEmployee);

module.exports = router;