import React, { useState, useContext } from "react";
import ApplyJobModal from "./ApplyJobModal";
import { getJobImage } from "../utils/jobImages";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MapPin, Banknote, Briefcase, Zap } from "lucide-react";

const JobCard = ({ job }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleApplyClick = () => {
    if (!user?.isLoggedIn) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (user.role !== "worker") {
      alert("Only workers can apply for jobs");
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <div className="job-card-modern">
        <div className="card-image-wrapper">
          <img src={getJobImage(job.title)} alt={job.title} />
          <div className="job-badge">{job.jobType}</div>
        </div>

        <div className="card-content">
          <h3 className="job-title">{job.title}</h3>

          <div className="job-info-grid">
            <div className="info-item location">
              <MapPin size={16} color="#3b82f6" />
              <span className="card-span">{job.location}</span>
            </div>
            <div className="info-item wage">
              <Banknote size={16} color="#1E656D" />
              <span className="bold-wage">₹{job.wage} / day</span>
            </div>
            <div className="info-item type">
              <Briefcase size={16} color="#64748b" />
              <span className="card-span">Full Time</span>
            </div>
          </div>

          <button className="apply-btn-modern" onClick={handleApplyClick}>
            <Zap size={18} fill="currentColor" />
            Apply Now
          </button>
        </div>
      </div>

      <ApplyJobModal show={showModal} onClose={() => setShowModal(false)} job={job} />
    </>
  );
};

export default JobCard;