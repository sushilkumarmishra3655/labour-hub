import React, { useState, useContext } from "react";
import ApplyJobModal from "./ApplyJobModal";
import { getJobImage } from "../utils/jobImages";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MapPin, Banknote, Briefcase, Zap } from "lucide-react";

const JobCard = ({ job }) => {
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(AuthContext);

  // 🔥 APPLY BUTTON LOGIC
  const handleApplyClick = () => {
    // ❌ Not logged in → go to login
    if (!user || !user.isLoggedIn) {
      navigate("/login", {
        state: {
          from: location.pathname, // 👈 back to same page after login
          jobId: job._id || job.id, // (future use - optional)
        },
      });
      return;
    }

    // ❌ Wrong role
    if (user.role !== "worker") {
      alert("Only workers can apply for jobs");
      return;
    }

    // ✅ Open Apply Modal
    setShowModal(true);
  };

  return (
    <>
      <div className="job-card-modern">
        
        {/* IMAGE */}
        <div className="card-image-wrapper">
          <img src={getJobImage(job.title)} alt={job.title} />
          <div className="job-badge">{job.jobType || "Full Time"}</div>
        </div>

        {/* CONTENT */}
        <div className="card-content">
          <h3 className="job-title">{job.title}</h3>

          <div className="job-info-grid">
            
            {/* LOCATION */}
            <div className="info-item location">
              <MapPin size={16} color="#3b82f6" />
              <span className="card-span">
                {job.location || "Not specified"}
              </span>
            </div>

            {/* WAGE */}
            <div className="info-item wage">
              <Banknote size={16} color="#1E656D" />
              <span className="bold-wage">
                ₹{job.wage || "0"} / day
              </span>
            </div>

            {/* TYPE */}
            <div className="info-item type">
              <Briefcase size={16} color="#64748b" />
              <span className="card-span">
                {job.jobType || "Full Time"}
              </span>
            </div>

          </div>

          {/* APPLY BUTTON */}
          <button className="apply-btn-modern" onClick={handleApplyClick}>
            <Zap size={18} fill="currentColor" />
            Apply Now
          </button>
        </div>
      </div>

      {/* APPLY MODAL */}
      <ApplyJobModal
        show={showModal}
        onClose={() => setShowModal(false)}
        job={job}
      />
    </>
  );
};

export default JobCard;