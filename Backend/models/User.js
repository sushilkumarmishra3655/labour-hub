const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String
  },
  gender: {
    type: String
  },
  role: {
    type: String,
    enum: ["worker", "employer", "admin"]
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  address: {
    type: String
  },
  skills: {
    type: [String]
  },
  experience: {
    type: String
  },
  profileImage: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);