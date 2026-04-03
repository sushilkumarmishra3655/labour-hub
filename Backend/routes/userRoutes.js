const express = require("express");
const router = express.Router();

const { getUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔥 PROFILE ROUTE
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
module.exports = router;