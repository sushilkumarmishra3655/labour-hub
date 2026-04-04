const Job = require("../models/job");
const User = require("../models/User");
const Application = require("../models/Application");

// @desc    Get all users (excluding admins, typically)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    // Already checked in middleware, but extra check
    if (req.user && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all jobs for admin (includes pending, approved, rejected)
// @route   GET /api/admin/jobs
// @access  Private/Admin
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Approve a job posting
// @route   PATCH /api/admin/jobs/:id/approve
// @access  Private/Admin
const approveJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error approving job" });
  }
};

// @desc    Reject a job posting
// @route   PATCH /api/admin/jobs/:id/reject
// @access  Private/Admin
const rejectJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error rejecting job" });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
};

// @desc    Get all applications (admin view)
// @route   GET /api/admin/applications
// @access  Private/Admin
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({}).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching admin applications:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete an application (admin only)
// @route   DELETE /api/admin/applications/:id
// @access  Private/Admin
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting application" });
  }
};

module.exports = {
  getAllUsers,
  getAllJobs,
  approveJob,
  rejectJob,
  deleteJob,
  getAllApplications,
  deleteApplication
};
