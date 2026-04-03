const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  postJob, 
  getJobs, 
  getEmployerJobs, 
  getJobById,
  updateJob, 
  deleteJob 
} = require("../controllers/jobController");

router.post("/", authMiddleware, postJob);
router.get("/", getJobs);
router.get("/employer", authMiddleware, getEmployerJobs);
router.get("/:id", getJobById);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;