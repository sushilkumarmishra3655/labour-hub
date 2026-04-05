const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  applyJob,
  getEmployerApplications,
  updateApplicationStatus,
  getEmployerStats,
  updateApplication,
  deleteApplication
} = require("../controllers/applicationController");

router.post("/", authMiddleware, applyJob);
router.get("/employer", authMiddleware, getEmployerApplications);
router.patch("/:id/status", authMiddleware, updateApplicationStatus);
router.get("/employer/dashboard-stats", authMiddleware, getEmployerStats);
router.patch("/:id", authMiddleware, updateApplication);
router.delete("/:id", authMiddleware, deleteApplication);

module.exports = router;