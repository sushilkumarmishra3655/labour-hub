const User = require("../models/User");
const Application = require("../models/Application");

// ✅ STATS
exports.getWorkerStats = async (req, res) => {
  try {
    const workerId = req.user.id;
    const applications = await Application.find({ workerId });

    const stats = {
      totalApplied: applications.length,
      pendingJobs: applications.filter(a => a.status === "Pending").length,
      acceptedJobs: applications.filter(a => a.status === "Accepted").length,
      rejectedJobs: applications.filter(a => a.status === "Rejected").length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ APPLICATIONS
exports.getWorkerApplications = async (req, res) => {
  try {
    const workerId = req.user.id;

    const applications = await Application.find({ workerId })
      .sort({ createdAt: -1 }); // 🔥 correct sorting

    const formattedApps = applications.map(app => ({
      _id: app._id,
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      company: app.employerName,
      location: app.location,
      salary: app.wage,
      status: app.status,
      appliedAt: app.createdAt,
    }));

    res.json(formattedApps);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ PROFILE
exports.getWorkerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Worker not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ UPDATE PROFILE
exports.updateWorkerProfile = async (req, res) => {
  try {
    const { name, phone, location, skills, experience, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, location, skills, experience, profileImage },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "Worker not found" });

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};