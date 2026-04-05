import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import ApplyJobModal from "../component/ApplyJobModal";
import { getJobImage } from "../utils/jobImages";
import { 
  MapPin, IndianRupee, Briefcase, Calendar, 
  ChevronLeft, Zap, Users, Info, Building2, HardHat 
} from "lucide-react";
import "./JobDetail.css";

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
      <div className="job-detail-page-v3">
        <div className="job-detail-card-v3 skeleton-pulse" style={{ height: '600px' }}></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-page-v3">
        <div className="job-detail-card-v3" style={{ padding: '60px', textAlign: 'center' }}>
          <Info size={64} color="#ef4444" style={{ marginBottom: '24px' }} />
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a' }}>Oops!</h2>
          <p style={{ color: '#64748b', marginBottom: '32px' }}>{error || "Job details could not be found."}</p>
          <button className="jd-apply-btn-v3" style={{ width: 'auto', margin: '0 auto' }} onClick={() => navigate("/FindWork")}>
            Back to Find Work
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page-v3">
      <div className="job-detail-card-v3">
        {/* HEADER SECTION */}
        <section className="jd-header-v3">
          <button className="jd-back-btn-v3" onClick={() => navigate(-1)}>
            <ChevronLeft size={22} color="#0f172a" />
          </button>
          
          <img src={getJobImage(job.title)} alt={job.title} className="jd-header-image-v3" />
          
          <div className="jd-header-overlay-v3">
            <div className="jd-title-group-v3">
               <h1>{job.title}</h1>
               <div className="jd-meta-row-v3">
                  <span><Building2 size={16} /> {job.employerName || "Direct Employer"}</span>
                  <span>•</span>
                  <span><Calendar size={16} /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
          </div>
        </section>

        {/* MAIN BODY */}
        <div className="jd-content-v3">
          <div className="jd-main-info-v3">
            {/* SPECS GRID */}
            <div className="jd-specs-grid-v3">
               <div className="jd-spec-card-v3">
                  <div className="jd-spec-icon-v3" style={{ color: '#3b82f6' }}><MapPin size={22} /></div>
                  <div className="jd-spec-text-v3">
                     <label>Location</label>
                     <span>{job.location}</span>
                  </div>
               </div>
               
               <div className="jd-spec-card-v3">
                  <div className="jd-spec-icon-v3" style={{ color: '#0ea5e9' }}><IndianRupee size={22} /></div>
                  <div className="jd-spec-text-v3">
                     <label>Daily Wage</label>
                     <span>₹{job.wage}</span>
                  </div>
               </div>

               <div className="jd-spec-card-v3">
                  <div className="jd-spec-icon-v3" style={{ color: '#64748b' }}><Briefcase size={22} /></div>
                  <div className="jd-spec-text-v3">
                     <label>Contract</label>
                     <span>{job.jobType || "Full Time"}</span>
                  </div>
               </div>

               <div className="jd-spec-card-v3">
                  <div className="jd-spec-icon-v3" style={{ color: '#f59e0b' }}><HardHat size={22} /></div>
                  <div className="jd-spec-text-v3">
                     <label>Category</label>
                     <span>{job.category || "General"}</span>
                  </div>
               </div>
            </div>

            {/* DESCRIPTION */}
            <section className="jd-description-v3">
               <h3>About this work</h3>
               <p>{job.description || "The employer hasn't provided a detailed description for this role. You can discuss details during the interview OR once you apply."}</p>
            </section>
          </div>

          {/* ACTION SIDEBAR */}
          <aside className="jd-action-card-v3">
            <div className="jd-salary-card-v3">
               <span className="label">Total Daily Pay</span>
               <div className="amount">₹{job.wage}<span className="unit">/day</span></div>
            </div>

            <button className="jd-apply-btn-v3" onClick={handleApplyClick}>
               <Zap size={20} fill="#fff" />
               Apply Now
            </button>

            <div className="jd-safety-hint-v3">
               🛡️ LabourHub Verified Job. Always discuss safety equipment before starting work.
            </div>
          </aside>
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
