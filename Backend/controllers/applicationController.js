const Application = require("../models/Application");
const Job = require("../models/job");
const User = require("../models/User");

// APPLY JOB
exports.applyJob = async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET EMPLOYER APPLICATIONS
exports.getEmployerApplications = async (req, res) => {
  try {
    const employerId = req.user.id;
    const applications = await Application.find({ employerId }).sort({ createdAt: -1 });

    // MANUALLY FETCH WORKER DETAILS FOR EACH APPLICATION
    const enrichedApps = await Promise.all(applications.map(async (app) => {
      const worker = await User.findById(app.workerId).select("name phone email location skills experience profileImage");
      return {
        ...app.toObject(),
        workerDetails: worker || null
      };
    }));

    res.status(200).json(enrichedApps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE APPLICATION STATUS
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["Accepted", "Rejected", "Pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (!application) return res.status(404).json({ message: "Application not found" });

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET EMPLOYER DASHBOARD STATS
exports.getEmployerStats = async (req, res) => {
  try {
    const employerId = req.user.id;
    
    // Total jobs posted by this employer
    const activeJobs = await Job.countDocuments({ 
        employerId, 
        status: { $in: ["Approved", "Pending"] } 
    });

    const applications = await Application.find({ employerId });

    const stats = {
      activeJobs,
      pendingReview: applications.filter(a => a.status === "Pending").length,
      totalHired: applications.filter(a => a.status === "Accepted").length,
      totalApplications: applications.length
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};