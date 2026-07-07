const express = require("express");
const router = express.Router();

const {
  addEmployee,
  getEmployees,
  getMyEmployeeProfile,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Employee - View own profile
router.get(
  "/me",
  protect,
  authorizeRoles("employee"),
  getMyEmployeeProfile
);

// Create Employee - Admin and HR with photo upload
router.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  upload.single("photo"),
  addEmployee
);

// Get All Employees - Admin and HR
router.get("/", protect, authorizeRoles("admin", "hr"), getEmployees);

// Update Employee - Admin and HR with optional photo upload
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  upload.single("photo"),
  updateEmployee
);

// Delete Employee - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteEmployee);

module.exports = router;