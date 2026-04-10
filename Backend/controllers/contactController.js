const Contact = require("../models/Contact");

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const contact = await Contact.create({
      name,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: "Message sent successfully! We will contact you soon.",
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};

// @desc    Get all contact queries
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contact queries:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update contact status
// @route   PATCH /api/contact/:id
// @access  Private/Admin
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Query not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a contact query
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Query not found" });
    }
    res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact query:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
};
