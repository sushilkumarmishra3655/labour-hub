const User = require("../models/User");


// REGISTER
exports.registerUser = async (req, res) => {

  try {

    const { name, phone, gender, role, password } = req.body;

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = new User({
      name,
      phone,
      gender,
      role,
      password
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};



// LOGIN
exports.loginUser = async (req, res) => {

  try {

    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        message: "Invalid phone or password"
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid phone or password"
      });
    }

    res.json({
      id: user._id,
      name: user.name,
      role: user.role
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};