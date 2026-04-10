const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    phone: {
      type: String,
      required: [true, "Please provide your mobile number"],
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
      required: [true, "Please provide a message or description of your query"],
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved"],
      default: "Pending",
    },
    adminResponse: {
      type: String,
    },
    respondedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
