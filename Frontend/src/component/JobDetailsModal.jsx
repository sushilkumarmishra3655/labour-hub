import React from "react";
import { getJobImage } from "../utils/jobImages";
import { MapPin, Banknote, Briefcase, Calendar, X, Zap, Users, Info, Clock, AlertCircle } from "lucide-react";
import "./JobDetailsModal.css";

const JobDetailsModal = ({ show, onClose, job, onApply, isApplying }) => {
  if (!show || !job) return null;

  return (
    <div className="job-details-overlay" onClick={onClose}>
      <div className="job-details-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER / IMAGE */}
        <div className="modal-top-section">
          <img src={getJobImage(job.title)} alt={job.title} className="modal-cover-img" />
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
          <div className="modal-category-badge">{job.category || "General"}</div>
        </div>

        <div className="modal-scroll-content">
          <div className="modal-main-header">
            <h2 className="modal-job-title">{job.title}</h2>
            <div className="modal-job-meta">
              <span className="modal-employer-name">Posted by {job.employerName || "Employer"}</span>
              <span className="modal-post-date">
                <Calendar size={14} /> {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="modal-info-grid">
            <div className="modal-info-item">
              <MapPin size={18} color="#3b82f6" />
              <div>
                <label>Location</label>
                <p>{job.location}</p>
              </div>
            </div>
            <div className="modal-info-item">
              <Banknote size={18} color="#10b981" />
              <div>
                <label>Daily Wage</label>
                <p>₹{job.wage}</p>
              </div>
            </div>
            <div className="modal-info-item">
              <Clock size={18} color="#f59e0b" />
              <div>
                <label>Shift / Timing</label>
                <p>{job.shift || "Day Shift"}</p>
              </div>
            </div>
            <div className="modal-info-item">
              <Briefcase size={18} color="#6366f1" />
              <div>
                <label>Job Type</label>
                <p>{job.jobType || "Temporary"}</p>
              </div>
            </div>
          </div>

          {job.urgent && (
            <div className="urgent-banner-v2">
               <AlertCircle size={18} />
               <span>This is an urgent requirement!</span>
            </div>
          )}

          <div className="modal-description-section">
            <h3>Work Description</h3>
            <p>{job.description || "The employer has not provided a detailed description, but you can apply and discuss the work details via phone after your application is accepted."}</p>
          </div>
          
          <div className="modal-requirements">
             <div className="req-box">
                <Users size={16} />
                <span>{job.workersNeeded || 1} Workers Needed</span>
             </div>
          </div>
        </div>

        <div className="modal-footer-actions">
           <button className="secondary-modal-btn" onClick={onClose}>Close</button>
           <button 
              className={`primary-modal-apply-btn ${isApplying ? "applying" : ""}`} 
              onClick={() => { onApply(); onClose(); }}
              disabled={isApplying}
           >
              <Zap size={18} fill="currentColor" />
              {isApplying ? "Applying..." : "One-Click Apply"}
           </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
