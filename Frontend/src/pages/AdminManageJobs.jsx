import { useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Briefcase, Search, CheckCircle, XCircle, Trash2, Eye, MapPin, Clock, IndianRupee, Building, X, Award, AlertTriangle, Layers, Users, Phone, Mail, Calendar } from "lucide-react";
import api from "../services/api";
import "./AdminDashboard.css";

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

const AdminManageJobs = () => {
  const { user } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Jobs fetch error:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  const handleApprove = async (id) => {
    setIsActionLoading(true);
    try {
      await api.patch(`/admin/jobs/${id}/approve`);
      setJobs(prev => prev.map(job =>
        job._id === id ? { ...job, status: "Approved" } : job
      ));
      if (selectedJob?._id === id) setSelectedJob(prev => ({ ...prev, status: "Approved" }));
    } catch (err) {
      alert("Failed to approve job");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    setIsActionLoading(true);
    try {
      await api.patch(`/admin/jobs/${id}/reject`);
      setJobs(prev => prev.map(job =>
        job._id === id ? { ...job, status: "Rejected" } : job
      ));
      if (selectedJob?._id === id) setSelectedJob(prev => ({ ...prev, status: "Rejected" }));
    } catch (err) {
      alert("Failed to reject job");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job? This will remove all associated applications as well.")) return;
    setIsActionLoading(true);
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs(prev => prev.filter(job => job._id !== id));
      setSelectedJob(null);
    } catch (err) {
      alert("Failed to delete job");
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    let list = jobs;
    if (filter !== "All") {
      list = list.filter(j => j.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [jobs, filter, search]);

  if (!user) return null;

  return (
    <div className="admin-dashboard admin-dashboard-content-wrapper">
      <header className="admin-welcome-section">
        <div className="admin-welcome-text">
          <h1>Manage Job Postings 💼</h1>
          <p>Review, approve, or moderate all current listings across the platform.</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* ── Quick Stats ── */}
      <section className="admin-stat-grid-modern" style={{ marginBottom: '32px' }}>
        <div 
          className={`admin-stat-card-v2 interactive ${filter === "All" ? "active-stat" : ""}`} 
          onClick={() => setFilter("All")}
        >
          <div className="admin-icon-v2 blue"><Briefcase size={22} /></div>
          <div className="admin-data-v2">
            <h3>{jobs.length}</h3>
            <span>Total Posts</span>
          </div>
        </div>
        <div 
          className={`admin-stat-card-v2 interactive ${filter === "Pending" ? "active-stat" : ""}`}
          onClick={() => setFilter("Pending")}
        >
          <div className="admin-icon-v2 amber"><Clock size={22} /></div>
          <div className="admin-data-v2">
            <h3>{jobs.filter(j => j.status === "Pending").length}</h3>
            <span>Pending Review</span>
          </div>
        </div>
        <div 
          className={`admin-stat-card-v2 interactive ${filter === "Approved" ? "active-stat" : ""}`}
          onClick={() => setFilter("Approved")}
        >
          <div className="admin-icon-v2 green"><CheckCircle size={22} /></div>
          <div className="admin-data-v2">
            <h3>{jobs.filter(j => j.status === "Approved").length}</h3>
            <span>Active Jobs</span>
          </div>
        </div>
      </section>

      <div className="admin-toolbar-v2">
        <div className="admin-search-box-v2">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search by title, location, or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-segmented-control">
          {FILTERS.map(tab => (
            <button
              key={tab}
              className={filter === tab ? "active" : ""}
              onClick={() => setFilter(tab)}
            >
              {tab}
              <span className="admin-tab-badge">
                {tab === "All" ? jobs.length : jobs.filter(j => j.status === tab).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <main className="main-panel">
        {loading ? (
          <div className="job-list-v2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="job-card-v2 skeleton-pulse">
                <div className="job-card-info" style={{ height: '80px' }}></div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="admin-empty-state-v2">
            <div className="admin-empty-icon-circle">🔭</div>
            <h2>No listings found</h2>
            <p>Try refining your search or filters to see more results.</p>
            <button className="btn-secondary-outline" onClick={() => { setFilter("All"); setSearch(""); }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="job-list-v2">
            {filteredJobs.map((job, i) => {
              const statusKey = job.status?.toLowerCase() || "pending";
              return (
                <div 
                  key={job._id} 
                  className="job-card-v2" 
                  style={{ animationDelay: `${i * 30}ms`, cursor: 'pointer' }}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="job-card-info">
                    <div className={`job-icon-box ${statusKey}`}>
                      {job.title?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="job-meta-box">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4>{job.title}</h4>
                        <span className={`status-tag ${statusKey}`} style={{ fontSize: '10px', height: 'fit-content' }}>
                          {job.status}
                        </span>
                      </div>
                      <div className="job-tags" style={{ marginTop: '4px' }}>
                        <span><Building size={14} /> {job.company || "Direct Employer"}</span>
                        <span><MapPin size={14} /> {job.location}</span>
                        <span><Clock size={14} /> {job.jobType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="job-card-right">
                    <span style={{ fontSize: '12px', color: 'var(--primary-blue)', fontWeight: '600', marginRight: '10px' }}>Details</span>
                    <div className="salary-badge" style={{ marginRight: '16px' }}>
                      <IndianRupee size={14} /> <strong>{job.wage}</strong><span>/day</span>
                    </div>

                    <div className="card-actions">
                      {job.status === "Pending" && (
                        <>
                          <button
                            className="act-btn"
                            style={{ color: 'var(--primary-green)', background: '#f0fdf4' }}
                            onClick={(e) => { e.stopPropagation(); handleApprove(job._id); }}
                            title="Approve Listing"
                            disabled={isActionLoading}
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            className="act-btn"
                            style={{ color: 'var(--clr-pending)', background: '#fffbeb' }}
                            onClick={(e) => { e.stopPropagation(); handleReject(job._id); }}
                            title="Reject Listing"
                            disabled={isActionLoading}
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}

                      <button
                        className="act-btn del"
                        onClick={(e) => { e.stopPropagation(); handleDelete(job._id); }}
                        title="Delete Permanently"
                        disabled={isActionLoading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Job Details Popup ── */}
      {selectedJob && (
        <div className="popup-overlay" onClick={() => setSelectedJob(null)}>
          <div className="inline-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <div className="popup-title">
                <Award size={20} color="var(--primary-blue)" />
                <h3>Job Listing Details</h3>
              </div>
              <button className="popup-close" onClick={() => setSelectedJob(null)}><X size={18} /></button>
            </div>

            <div className="worker-details-content">
              <div className="admin-u-header-v3">
                <div className={`admin-u-avatar-v3 worker`}>
                  {selectedJob.title?.charAt(0).toUpperCase()}
                </div>
                <div className="admin-u-title-v3">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2>{selectedJob.title}</h2>
                    <span className={`status-tag ${selectedJob.status?.toLowerCase()}`}>{selectedJob.status}</span>
                  </div>
                  <p>Posted by {selectedJob.company || "Direct Employer"} • {new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="admin-u-grid-v3">
                <div className="admin-u-item-v3">
                  <label><IndianRupee size={14} /> Daily Wage</label>
                  <p>₹{selectedJob.wage} / day</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><Layers size={14} /> Category</label>
                  <p>{selectedJob.category || "Uncategorized"}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><MapPin size={14} /> Location</label>
                  <p>{selectedJob.location}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><Clock size={14} /> Job Type / Shift</label>
                  <p>{selectedJob.jobType} • {selectedJob.shift || "Day Shift"}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><Users size={14} /> Workers Needed</label>
                  <p>{selectedJob.workersNeeded || 1} Person</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><Phone size={14} /> Contact Phone</label>
                  <p>{selectedJob.phone || "N/A"}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><Mail size={14} /> Business Email</label>
                  <p>{selectedJob.email || "N/A"}</p>
                </div>
                <div className="admin-u-item-v3">
                   <label><AlertTriangle size={14} /> Urgency</label>
                   <p>{selectedJob.urgent ? "🚨 High Priority" : "Standard Hiring"}</p>
                </div>
              </div>

              {selectedJob.description && (
                <div className="u-exp-v3">
                  <label>Job Description</label>
                  <p style={{ lineHeight: '1.6', color: '#475569' }}>{selectedJob.description}</p>
                </div>
              )}
            </div>

            <div className="popup-footer">
              <button className="p-btn-cancel" onClick={() => setSelectedJob(null)}>Close</button>
              
              {selectedJob.status === "Pending" ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="p-btn-save" 
                    style={{ background: 'var(--primary-green)' }}
                    onClick={() => handleApprove(selectedJob._id)}
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? "..." : "Approve Job"}
                  </button>
                  <button 
                    className="p-btn-save" 
                    style={{ background: 'var(--clr-pending)' }}
                    onClick={() => handleReject(selectedJob._id)}
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? "..." : "Reject Job"}
                  </button>
                </div>
              ) : (
                <button 
                  className="p-btn-save" 
                  onClick={() => handleDelete(selectedJob._id)}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? "Deleting..." : "Delete Listing"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageJobs;
