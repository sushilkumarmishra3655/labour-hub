const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  getAllUsers, 
  getAllJobs, 
  approveJob, 
  rejectJob, 
  deleteJob,
  getAllApplications,
  deleteApplication
} = require("../controllers/adminController");

// Protected Admin Routes
router.get("/users", authMiddleware, getAllUsers);
router.get("/jobs", authMiddleware, getAllJobs);
router.patch("/jobs/:id/approve", authMiddleware, approveJob);
router.patch("/jobs/:id/reject", authMiddleware, rejectJob);
router.delete("/jobs/:id", authMiddleware, deleteJob);

// Application Management
router.get("/applications", authMiddleware, getAllApplications);
router.delete("/applications/:id", authMiddleware, deleteApplication);

module.exports = router;
