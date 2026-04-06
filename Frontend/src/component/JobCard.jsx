import React, { useState, useContext } from "react";
import { getJobImage } from "../utils/jobImages";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import JobDetailsModal from "./JobDetailsModal"; // 🔥 NEW MODAL
import { MapPin, Banknote, Briefcase, Zap, Eye } from "lucide-react";

const JobCard = ({ job }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // 🔥 Modal state
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // 🔥 ONE-CLICK APPLY LOGIC
  const handleApplyClick = async (e) => {
    if (e) e.stopPropagation(); // Stop from opening details

    // ❌ Not logged in → go to login
    if (!user || !user.isLoggedIn) {
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    // ❌ Wrong role
    if (user.role !== "worker") {
      toast.error("Only workers can apply for jobs");
      return;
    }

    if (isApplying) return;

    try {
      setIsApplying(true);

      const newApplication = {
        jobId: job._id || job.id,
        jobTitle: job.title,
        location: job.location,
        wage: job.wage,
        workerId: user.id,
        workerName: user.name || "Worker",
        workerPhone: user.phone || "N/A",
        employerId: job.employerId,
        employerName: job.employerName || "Employer",
        message: "I am interested in this job (One-click Application)",
        status: "Pending"
      };

      const res = await api.post("/applications", newApplication);

      if (res.status === 201) {
        toast.success("Applied successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to apply. You might have already applied.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
      <div className="job-card-modern" onClick={() => setShowDetails(true)}>
        
        {/* IMAGE */}
        <div className="card-image-wrapper">
          <img src={getJobImage(job.title)} alt={job.title} />
          {job.urgent && <div className="job-badge urgent">URGENT</div>}
          {!job.urgent && <div className="job-badge">{job.jobType || "Full Time"}</div>}
        </div>

        {/* CONTENT */}
        <div className="card-content">
          <h3 className="job-title">{job.title}</h3>

          <div className="job-info-grid">
            
            <div className="info-item location">
              <MapPin size={16} color="#3b82f6" />
              <span className="card-span">{job.location || "Not specified"}</span>
            </div>

            <div className="info-item wage">
              <Banknote size={16} color="#1E656D" />
              <span className="bold-wage">₹{job.wage || "0"} / day</span>
            </div>

            <div className="info-item type">
              <Briefcase size={16} color="#64748b" />
              <span className="card-span">{job.jobType || "Full Time"}</span>
            </div>

          </div>

          <div className="card-btns-row">
            <button className="view-details-btn" onClick={(e) => { e.stopPropagation(); setShowDetails(true); }}>
              <Eye size={18} />
              Details
            </button>
            <button 
              className={`apply-btn-modern ${isApplying ? "loading" : ""}`} 
              onClick={handleApplyClick}
              disabled={isApplying}
            >
              <Zap size={18} fill="currentColor" />
              {isApplying ? "Applying..." : "Apply Now"}
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      <JobDetailsModal 
        show={showDetails} 
        onClose={() => setShowDetails(false)} 
        job={job}
        onApply={handleApplyClick}
        isApplying={isApplying}
      />
    </>
  );
};

export default JobCard;