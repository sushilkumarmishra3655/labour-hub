const express = require("express");
const router = express.Router();

const { getUserProfile, updateProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔥 PROFILE ROUTE
router.get("/profile", authMiddleware, getUserProfile);
router.put("/update-profile", authMiddleware, updateProfile);

module.exports = router;
module.exports = router;