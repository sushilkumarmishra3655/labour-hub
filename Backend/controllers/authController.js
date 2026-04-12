const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { contact } = req.body; // email or phone

    const user = await User.findOne({
      $or: [{ email: contact }, { phone: contact }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email or phone" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    user.resetOtp = otp;
    user.resetOtpExpire = otpExpire;
    await user.save();

    // Send OTP via Email (if email exists)
    if (user.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || "your-email@gmail.com",
          pass: process.env.EMAIL_PASS || "your-app-password"
        }
      });

      const mailOptions = {
        from: `"Labour Hub" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset OTP - Labour Hub",
        text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
        html: `<h3>Password Reset OTP</h3><p>Your OTP for password reset is: <b>${otp}</b></p><p>It will expire in 10 minutes.</p>`
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${user.email}: ${otp}`);
      } catch (err) {
        console.error("Email send error:", err);
        // Even if email fails, we might still return success if it's a test environment
      }
    }

    // For Phone, we simulate sending (log it)
    console.log(`OTP for ${user.phone}: ${otp}`);

    res.json({ message: "OTP sent successfully to your registered email/phone" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { contact, otp } = req.body;

    const user = await User.findOne({
      $or: [{ email: contact }, { phone: contact }],
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified successfully", success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { contact, otp, newPassword } = req.body;

    const user = await User.findOne({
      $or: [{ email: contact }, { phone: contact }],
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP request" });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.json({ message: "Your password has been updated successfully!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, dob, gender, role, password, address } = req.body;

    // Server-side age validation (18+)
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age < 18) {
        return res.status(400).json({ message: "You must be at least 18 years old to register" });
      }
    }

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({ message: "User phone number already registered" });
    }

    // Role protection: block admin registration from public endpoint
    if (role === "admin") {
      return res.status(403).json({ message: "Admin registration is not allowed from this page" });
    }

    const user = new User({
      name,
      email: email || "",
      phone,
      dob: dob || null,
      gender: gender || "",
      role: role || "worker",
      password, // Will be hashed by pre-save hook
      address: address || "",
      location: address || ""
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "Invalid phone or password" });
    }

    // Use the comparePassword method defined in User model
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid phone or password" });
    }

    // Migration: If password is not hashed, hash it now and save
    const isHashed = user.password.startsWith("$2a$") || user.password.startsWith("$2b$");
    if (!isHashed) {
      user.password = password; // Trigger the pre-save hook
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        address: user.address,
        location: user.location,
        skills: user.skills,
        experience: user.experience,
        profileImage: user.profileImage,
        isPremium: user.isPremium
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};