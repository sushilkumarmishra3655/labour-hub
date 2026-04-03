import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import ApplyJobModal from "../component/ApplyJobModal";
import { getJobImage } from "../utils/jobImages";
import { MapPin, Banknote, Briefcase, Calendar, ChevronLeft, Zap, Users, Info } from "lucide-react";
import "./FindWork.css"; // Reuse some styles or create a new one

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Fetch job error:", err);
        setError("Job not found or failed to load details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    if (!user || !user.isLoggedIn) {
      navigate("/login", { state: { from: `/job/${id}` } });
      return;
    }
    if (user.role !== "worker") {
      alert("Only workers can apply for jobs");
      return;
    }
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="job-detail-container loading-state">
        <div className="skeleton-pulse" style={{ height: '300px', borderRadius: '12px', marginBottom: '20px' }}></div>
        <div className="skeleton-pulse" style={{ height: '40px', width: '60%', marginBottom: '10px' }}></div>
        <div className="skeleton-pulse" style={{ height: '20px', width: '40%' }}></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-container error-state">
        <div className="error-card">
          <Info size={48} color="#ef4444" />
          <h2>Oops!</h2>
          <p>{error || "Job details could not be found."}</p>
          <button className="btn-create" onClick={() => navigate("/FindWork")}>
            Back to Find Work
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        {/* BACK BUTTON */}
        <button className="back-nav-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} /> Back
        </button>

        <div className="job-detail-main-card">
          {/* IMAGE SECTION */}
          <div className="detail-image-section">
            <img src={getJobImage(job.title)} alt={job.title} />
            <div className="detail-badge">{job.jobType || "Full Time"}</div>
          </div>

          {/* CONTENT SECTION */}
          <div className="detail-info-section">
            <div className="detail-header">
              <h1 className="detail-title">{job.title}</h1>
              <div className="detail-meta">
                <span className="employer-name">Posted by: {job.employerName || "Direct Employer"}</span>
                <span className="post-date">
                  <Calendar size={14} /> 
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="specs-grid">
              <div className="spec-item">
                <MapPin size={22} color="#3b82f6" />
                <div className="spec-text">
                  <label>Location</label>
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="spec-item">
                <Banknote size={22} color="#1E656D" />
                <div className="spec-text">
                  <label>Salary</label>
                  <span>₹{job.wage} / day</span>
                </div>
              </div>

              <div className="spec-item">
                <Briefcase size={22} color="#64748b" />
                <div className="spec-text">
                  <label>Job Type</label>
                  <span>{job.jobType || "Full Time"}</span>
                </div>
              </div>

              <div className="spec-item">
                <Users size={22} color="#f59e0b" />
                <div className="spec-text">
                  <label>Category</label>
                  <span>{job.category || "General"}</span>
                </div>
              </div>
            </div>

            <div className="job-description">
              <h3>About this work</h3>
              <p>{job.description || "No detailed description provided for this job."}</p>
            </div>

            <div className="detail-actions">
              <button className="apply-btn-large" onClick={handleApplyClick}>
                <Zap size={20} fill="currentColor" />
                Apply for this job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      <ApplyJobModal
        show={showModal}
        onClose={() => setShowModal(false)}
        job={job}
      />
    </div>
  );
};

export default JobDetail;
