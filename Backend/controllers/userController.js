const User = require("../models/User");

// 🔥 GET PROFILE
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password").populate("applications");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};