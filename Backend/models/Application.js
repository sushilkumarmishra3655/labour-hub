const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

  jobId: String,
  jobTitle: String,
  location: String,
  wage: Number,

  workerId: String,
  workerName: String,
  workerPhone: String,

  employerId: String,
  employerName: String,
  employerPhone: String,

  message: String,
  status: {
    type: String,
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Application", applicationSchema);