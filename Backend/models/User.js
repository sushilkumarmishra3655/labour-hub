const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
  dob: {
    type: Date
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
  },
  companyName: {
    type: String
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  resetOtp: {
    type: String
  },
  resetOtpExpire: {
    type: Date
  }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // If the password logic starts with $2a$ or $2b$ (bcrypt rounds), it's hashed
  const isHashed = this.password.startsWith("$2a$") || this.password.startsWith("$2b$");
  
  if (isHashed) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  
  // For legacy plain-text passwords
  return candidatePassword === this.password;
};

module.exports = mongoose.model("User", userSchema);