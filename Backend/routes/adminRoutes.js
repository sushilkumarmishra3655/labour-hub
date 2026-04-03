const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  getAllUsers, 
  getAllJobs, 
  approveJob, 
  rejectJob, 
  deleteJob 
} = require("../controllers/adminController");

// Protected Admin Routes
router.get("/users", authMiddleware, getAllUsers);
router.get("/jobs", authMiddleware, getAllJobs);
router.patch("/jobs/:id/approve", authMiddleware, approveJob);
router.patch("/jobs/:id/reject", authMiddleware, rejectJob);
router.delete("/jobs/:id", authMiddleware, deleteJob);

module.exports = router;
