const express = require("express");
const router = express.Router();

const { seedJuneData } = require("../controllers/seedController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/june", protect, authorizeRoles("admin", "hr"), seedJuneData);

module.exports = router;