const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createOrder,
  verifyPayment,
  getMySubscription,
} = require("../controllers/subscriptionController");

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);
router.get("/my-subscription", authMiddleware, getMySubscription);

module.exports = router;
