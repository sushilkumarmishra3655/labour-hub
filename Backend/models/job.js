const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({

  title: String,
  company: String,
  email: String,
  phone: String,

  location: String,
  wage: Number,

  jobType: String,
  category: String,

  workersNeeded: Number,
  shift: String,

  description: String,
  urgent: Boolean,

  employerId: String,
  employerName: String,
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Approved", "Rejected"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Job", jobSchema);