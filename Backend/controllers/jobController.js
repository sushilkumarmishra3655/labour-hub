const Job = require("../models/job");
const User = require("../models/User");

// POST JOB
exports.postJob = async (req, res) => {
  try {
    const employerId = req.user.id || req.body.employerId;

    // Check for subscription limits
    const user = await User.findById(employerId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isPremium) {
      const jobCount = await Job.countDocuments({ employerId });
      if (jobCount >= 1) {
        return res.status(403).json({ 
          message: "Free users can only post 1 job. Please upgrade to Premium for unlimited job posts.",
          limitReached: true
        });
      }
    }

    const jobData = {
      ...req.body,
      employerId: employerId,
      employerName: req.body.employerName || (req.user ? req.user.name : "Employer")
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      message: "Job posted successfully",
      job
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// GET ALL JOBS (Public)
exports.getJobs = async (req, res) => {

  try {
    // Show all jobs (requested by user to restore previous behavior)
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.json(jobs);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

// GET EMPLOYER JOBS
exports.getEmployerJobs = async (req, res) => {
  try {
    const employerId = req.user.id;
    const jobs = await Job.find({ employerId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE JOB
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user.id; // From token

    const job = await Job.findOneAndUpdate(
      { _id: id, employerId },
      req.body,
      { new: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });

    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE JOB
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user.id;

    const job = await Job.findOneAndDelete({ _id: id, employerId });

    if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET JOB BY ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};