import { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  Eye, Clock, CheckCircle, XCircle, Search,
  ArrowRight, Briefcase, MapPin, IndianRupee, Filter, Zap,
  ShieldCheck, Crown
} from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import toast from "react-hot-toast";
import api from "../services/api";
import "./WorkerDashboard.css";

const FILTERS = ["All", "Pending", "Accepted", "Rejected"];

const WorkerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    totalApplied: 0,
    pendingJobs: 0,
    acceptedJobs: 0,
    rejectedJobs: 0
  });
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isRoot = location.pathname === "/worker-dashboard" || location.pathname === "/worker-dashboard/";

  useEffect(() => {
    if (!user || !isRoot) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, appsRes, jobsRes] = await Promise.all([
          api.get("/worker/stats"),
          api.get("/worker/applications"),
          api.get("/jobs") // For recommendations
        ]);
        setStats(statsRes.data);
        setApplications(appsRes.data);

        // Simple recommendation logic: Latest 3 jobs matching category or just latest
        const allJobs = jobsRes.data || [];
        const recommended = allJobs
          .filter(j => !appsRes.data.some(a => a.jobId === j._id)) // Not already applied
          .slice(0, 3);
        setRecommendedJobs(recommended);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, isRoot]);

  const totalEarnings = applications
    .filter(a => a.status === 'Accepted')
    .reduce((sum, a) => sum + (Number(a.salary) || 0), 0);

  const profileCompletion = user ? (
    (user.name ? 20 : 0) +
    (user.phone ? 20 : 0) +
    (user.location ? 20 : 0) +
    (user.skills?.length > 0 ? 20 : 0) +
    (user.profileImage ? 20 : 0)
  ) : 0;

  const handleCancelApplication = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this application?")) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/applications/${id}`);
      if (res.data.success) {
        setApplications(prev => prev.filter(app => app._id !== id));
        setSelectedApp(null);
        // Refresh stats
        const statsRes = await api.get("/worker/stats");
        setStats(statsRes.data);
        toast.success("Application cancelled successfully!");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel application.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateApplication = async (id) => {
    try {
      setIsSaving(true);
      const res = await api.patch(`/applications/${id}`, { message: editedMessage });
      if (res.data.success) {
        setApplications(prev => prev.map(app => app._id === id ? { ...app, message: editedMessage } : app));
        setSelectedApp(prev => ({ ...prev, message: editedMessage }));
        setIsEditing(false);
        toast.success("Application updated successfully!");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update application.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredApps = useMemo(() => {
    let list = applications;
    if (filter !== "All") list = list.filter(a => a.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.jobTitle?.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q) ||
        a.company?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [applications, filter, search]);

  if (!user) return null;

  const statCards = [
    { icon: <Briefcase size={22} />, value: stats.totalApplied, label: "Total Applied", color: "blue" },
    { icon: <CheckCircle size={22} />, value: stats.acceptedJobs, label: "Accepted", color: "green" },
    { icon: <Clock size={22} />, value: stats.pendingJobs, label: "In Review", color: "amber" },
    { icon: <XCircle size={22} />, value: stats.rejectedJobs, label: "Rejected", color: "purple" },
  ];

  return (
    <DashboardLayout>
      {!isRoot ? (
        <Outlet />
      ) : (
        <div className="worker-dashboard worker-dashboard-content-wrapper">
          {/* ── Welcome Header ── */}
          <header className="worker-welcome-section">
            <div className="worker-welcome-text">
              <h1>Welcome back, {user.name.split(' ')[0]} 👋</h1>
              <p>Here's a quick overview of your career activity today.</p>
            </div>
            <div className="worker-header-actions">
              <button className="btn-explore-jobs" onClick={() => navigate("/findwork")}>
                Explore Jobs <Search size={18} />
              </button>
            </div>
          </header>

          {error && <div className="error-banner">{error}</div>}

          {/* ── Modern Stats Grid ── */}
          <section className="worker-stat-grid-modern">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="worker-stat-card-v2 skeleton-pulse">
                  <div className="worker-icon-v2 skeleton-bg"></div>
                  <div className="worker-data-v2">
                    <div className="skeleton-line-title"></div>
                    <div className="skeleton-line-sub"></div>
                  </div>
                </div>
              ))
            ) : (
              statCards.map((s, i) => (
                <div
                  key={i}
                  className="worker-stat-card-v2"
                  onClick={() => {
                    let filterStatus = "All";
                    if (s.label === "Accepted") filterStatus = "Accepted";
                    else if (s.label === "In Review") filterStatus = "Pending";
                    else if (s.label === "Rejected") filterStatus = "Rejected";
                    navigate("/worker-dashboard/applications", { state: { filter: filterStatus } });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`worker-icon-v2 ${s.color}`}>{s.icon}</div>
                  <div className="worker-data-v2">
                    <h3>{s.value}</h3>
                    <span>{s.label}</span>
                  </div>
                </div>
              ))
            )}
          </section>

          <div className="dashboard-content-grid-v3">
            {/* ── Main Column: Recent Activity ── */}
            <div className="dashboard-main-col-v3">
              <div className="section-header-v3">
                <div className="s-h-title">
                  <Clock size={20} color="var(--primary-blue)" />
                  <h3>Recent Applications</h3>
                </div>
                <button className="s-h-link" onClick={() => navigate("/worker-dashboard/applications")}>
                  View All <ArrowRight size={14} />
                </button>
              </div>

              {loading ? (
                <div className="worker-app-grid-v3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="worker-premium-card-v3 skeleton-pulse">
                      <div style={{ height: '180px' }}></div>
                    </div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="worker-empty-state-v3">
                  <div className="w-empty-icon-v3">✨</div>
                  <h3>Start your journey</h3>
                  <p>Discover jobs and start applying today!</p>
                  <button className="btn-explore-v3" onClick={() => navigate("/findwork")}>Explore Marketplace</button>
                </div>
              ) : (
                <div className="worker-app-grid-v3">
                  {applications.slice(0, 4).map((app) => (
                    <div key={app._id} className="worker-premium-card-v3">
                      <div className="w-card-status-indicator">
                        <div className={`status-tag ${app.status?.toLowerCase()}`}>
                          {app.status === 'Pending' ? '⌛ Pending' :
                            app.status === 'Accepted' ? '✅ Accepted' : '❌ Rejected'}
                        </div>
                      </div>

                      <div className="w-card-body-v3">
                        <div className="w-icon-bg">
                          {user.name?.[0]}
                        </div>
                        <div className="w-details-v3">
                          <h3>{app.jobTitle}</h3>
                          <div className="w-meta-v3">
                            🏢 <span>{app.company || "Direct Employer"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-stats-row-v3">
                        <div className="w-c-stat">
                          <label>Location</label>
                          <span>{app.location || "N/A"}</span>
                        </div>
                        <div className="w-c-stat">
                          <label>Applied</label>
                          <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="w-card-footer-v3">
                        <button className="w-act-btn-v3 w-view" onClick={() => setSelectedApp(app)}>
                          <Eye size={18} /> Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Sidebar: Recommendations & Stats ── */}
            <aside className="dashboard-sidebar-v3">
              {/* ── Career Insights ── */}
              <div className="sidebar-card-v3 career-insights">
                <div className="s-card-header">
                  <ShieldCheck size={18} color="var(--primary-blue)" />
                  <h4>Account Status</h4>
                </div>

                <div className="dashboard-sub-card">
                  <div className="sub-status-header">
                    {user.isPremium ? (
                      <div className="premium-active-tag">
                        <Crown size={14} fill="currentColor" /> Premium Member
                      </div>
                    ) : (
                      <div className="free-plan-tag">Free Plan</div>
                    )}
                  </div>
                  <p className="sub-tagline">
                    {user.isPremium 
                      ? "You have unlimited access to all features." 
                      : "Upgrade to unlock unlimited applications and top placement."}
                  </p>
                  <button 
                    className={user.isPremium ? "btn-manage-sub" : "btn-upgrade-glow"}
                    onClick={() => navigate('/worker-dashboard/profile')}
                  >
                    {user.isPremium ? "Manage Plan" : "Upgrade to Premium"}
                  </button>
                </div>

                <div className="profile-progress-container" style={{ marginTop: '20px' }}>
                  <div className="progress-label">
                    <span>{profileCompletion}% Complete</span>
                    <button onClick={() => navigate('/worker-dashboard/profile')}>Edit Profile</button>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${profileCompletion}%` }}></div>
                  </div>
                </div>
                <div className="earnings-preview">
                  <div className="e-label">Estimated Earnings</div>
                  <div className="e-value">₹ {totalEarnings.toLocaleString()}</div>
                  <div className="e-footer">From {stats.acceptedJobs} Successful Jobs</div>
                </div>
              </div>

              {/* ── Recommendations ── */}
              <div className="sidebar-card-v3 recommended-section">
                <div className="s-card-header">
                  <Zap size={18} color="#f59e0b" />
                  <h4>Jobs For You</h4>
                </div>
                <div className="recommended-list">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <div key={i} className="r-item-skeleton skeleton-pulse"></div>)
                  ) : recommendedJobs.length > 0 ? (
                    recommendedJobs.map(job => (
                      <div key={job._id} className="recommended-item" onClick={() => navigate(`/job/${job._id}`)}>
                        <div className="r-item-icon">{job.title?.[0]}</div>
                        <div className="r-item-info">
                          <h5>{job.title}</h5>
                          <span>₹{job.wage} • {job.location}</span>
                        </div>
                        <ArrowRight size={14} className="r-arrow" />
                      </div>
                    ))
                  ) : (
                    <p className="no-rec-text">No recommendations yet.</p>
                  )}
                </div>
                <button className="sidebar-view-all" onClick={() => navigate("/findwork")}>
                  Browse Marketplace
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* ── Details Modal ── */}
      {selectedApp && (
        <div className="popup-overlay" onClick={() => { setSelectedApp(null); setIsEditing(false); }}>
          <div className="inline-popup worker-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="popup-header-v3">
              <div className="popup-p-icon"><Briefcase size={20} /></div>
              <div className="popup-p-title">
                <h3>Job Details</h3>
                <span>Ref ID: #{selectedApp._id.slice(-6).toUpperCase()}</span>
              </div>
              <button className="popup-close-v3" onClick={() => { setSelectedApp(null); setIsEditing(false); }}>×</button>
            </div>

            <div className="worker-details-scroller">
              <div className="worker-details-content-v3">
                <div className="w-modal-header">
                  <h2 className="modal-job-title-v3">{selectedApp.jobTitle}</h2>
                  <div className="modal-meta-row-v3">
                    <span className="m-meta-item">🏢 {selectedApp.company || "Direct Employer"}</span>
                    <span className="m-divider">•</span>
                    <span className="m-meta-item">🗓️ Applied on {new Date(selectedApp.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="modal-stats-grid-v3">
                  <div className="m-stat-box-v3">
                    <label>Expected Wage</label>
                    <p><IndianRupee size={16} /> {selectedApp.salary} <span>/ day</span></p>
                  </div>
                  <div className="m-stat-box-v3">
                    <label>Job Location</label>
                    <p><MapPin size={16} /> {selectedApp.location}</p>
                  </div>
                </div>

                <div className="modal-section-v3">
                  <label className="m-section-label">Job Description</label>
                  <p className="m-section-text">{selectedApp.description || "The employer hasn't provided a detailed description for this role. You can discuss details during the interview."}</p>
                </div>

                <div className="modal-section-v3">
                  <div className="m-section-header-row">
                    <label className="m-section-label">Your Application Message</label>
                    {selectedApp.status === "Pending" && !isEditing && (
                      <button className="m-edit-btn" onClick={() => { setIsEditing(true); setEditedMessage(selectedApp.message || "I am interested in this job!"); }}>
                        ✏️ Edit Message
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <textarea
                      className="m-edit-textarea"
                      value={editedMessage}
                      onChange={(e) => setEditedMessage(e.target.value)}
                      rows={4}
                      placeholder="Tell the employer why you are a good fit..."
                    />
                  ) : (
                    <div className="m-message-bubble">
                      {selectedApp.message || "I am ready for the job!"}
                    </div>
                  )}
                </div>

                <div className="modal-status-v3">
                  <label className="m-section-label">Status History</label>
                  <div className="m-status-timeline">
                    <div className="m-timeline-item active">
                      <div className="m-timeline-icon"><Clock size={14} /></div>
                      <div className="m-timeline-info">
                        <strong>Application Submitted</strong>
                        <span>{new Date(selectedApp.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className={`m-timeline-item ${selectedApp.status !== "Pending" ? "active" : ""}`}>
                      <div className={`m-timeline-icon ${selectedApp.status === 'Accepted' ? 'success' : selectedApp.status === 'Rejected' ? 'danger' : ''}`}>
                        {selectedApp.status === 'Accepted' ? <CheckCircle size={14} /> :
                          selectedApp.status === 'Rejected' ? <XCircle size={14} /> : <Zap size={14} />}
                      </div>
                      <div className="m-timeline-info">
                        <strong>{selectedApp.status === "Pending" ? "Awaiting Decision" : `Application ${selectedApp.status}`}</strong>
                        <span>Employer review in progress</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="popup-footer-v3">
              <button className="p-btn-close-v3" onClick={() => { setSelectedApp(null); setIsEditing(false); }}>Close</button>
              <div className="p-footer-actions">
                {isEditing ? (
                  <button className="p-btn-save-v3" onClick={() => handleUpdateApplication(selectedApp._id)} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                ) : (
                  selectedApp.status === "Pending" && (
                    <button
                      className="p-btn-cancel-v3"
                      onClick={() => handleCancelApplication(selectedApp._id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Cancelling..." : "Cancel Application"}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default WorkerDashboard;