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
  }

});

module.exports = mongoose.model("User", userSchema);