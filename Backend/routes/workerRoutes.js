const express = require("express");
const router = express.Router();

const {
  getWorkerStats,
  getWorkerApplications,
  getWorkerProfile,
  updateWorkerProfile,
} = require("../controllers/workerController");

const authMiddleware = require("../middleware/authMiddleware");

// ✅ Middleware apply
router.use(authMiddleware);

// ✅ Routes
router.get("/stats", getWorkerStats);
router.get("/applications", getWorkerApplications);
router.get("/profile", getWorkerProfile);
router.put("/profile", updateWorkerProfile);

module.exports = router;