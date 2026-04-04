const User = require("../models/User");
const jwt = require("jsonwebtoken");

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, dob, gender, role, password, address, adminKey } = req.body;

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

    // Verify Admin Key if role is admin
    if (role === "admin" && adminKey !== "ADMIN@123") {
      return res.status(401).json({ message: "Invalid Admin Secret Key" });
    }

    const user = new User({
      name,
      email: email || "",
      phone,
      dob: dob || null,
      gender: gender || "",
      role: role || "worker",
      password,
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

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid phone or password" });
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
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};