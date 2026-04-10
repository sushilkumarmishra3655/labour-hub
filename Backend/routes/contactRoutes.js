const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  submitContact,
  getContacts,
  updateContactStatus,
  respondToContact,
  deleteContact,
} = require("../controllers/contactController");

// Public route to submit contact form
router.post("/", submitContact);

// Protected Admin Routes (Admin check is done inside the controller functions usually, or we can use the middleware if we update it)
// For now, following the adminController pattern where they check user.role
router.get("/", authMiddleware, getContacts);
router.patch("/:id", authMiddleware, updateContactStatus);
router.patch("/:id/respond", authMiddleware, respondToContact);
router.delete("/:id", authMiddleware, deleteContact);

module.exports = router;
