const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  applyJob, 
  getEmployerApplications, 
  updateApplicationStatus, 
  getEmployerStats 
} = require("../controllers/applicationController");

router.post("/", authMiddleware, applyJob);
router.get("/employer", authMiddleware, getEmployerApplications);
router.patch("/:id/status", authMiddleware, updateApplicationStatus);
router.get("/employer/dashboard-stats", authMiddleware, getEmployerStats);

module.exports = router;