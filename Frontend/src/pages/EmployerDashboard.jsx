import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Plus, Users, Briefcase, Clock, TrendingUp, Check, X, Eye, Phone, MapPin, Mail, Award, Calendar
} from "lucide-react";
import api from "../services/api";
import "./EmployerDashboard.css";

const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ activeJobs: 0, pendingReview: 0, totalHired: 0, totalApplications: 0 });
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // FETCH STATS & APPLICATIONS
  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [statsRes, appsRes] = await Promise.all([
        api.get("/applications/employer/dashboard-stats"),
        api.get("/applications/employer")
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
    } catch (e) {
      console.error("Dashboard Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // STATUS UPDATE (Accept / Reject)
  const handleStatusUpdate = async (id, newStatus) => {
    if (isActionLoading) return;
    if (!window.confirm(`Update status to ${newStatus}?`)) return;

    setIsActionLoading(true);
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      alert(`Success: Worker is now ${newStatus}`);

      // Update local application list immediately
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));

      // Refresh Stats
      const statsRes = await api.get("/applications/employer/dashboard-stats");
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Check console.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const statCards = [
    { icon: <Briefcase />, val: stats.activeJobs, label: "Active Jobs", color: "blue", path: "/employer-dashboard/manage-listings", filter: "Approved" },
    { icon: <Clock />, val: stats.pendingReview, label: "Pending Review", color: "amber", path: "/employer-dashboard/applications", filter: "Pending" },
    { icon: <Users />, val: stats.totalHired, label: "Total Hired", color: "green", path: "/employer-dashboard/applications", filter: "Accepted" },
    { icon: <TrendingUp />, val: stats.totalApplications, label: "Applications", color: "purple", path: "/employer-dashboard/applications", filter: "All" },
  ];

  if (loading) return <div className="employer-dashboard employer-dashboard-content-wrapper">Loading Employer Dashboard...</div>;

  return (
    <div className="employer-dashboard employer-dashboard-content-wrapper employer-db">
      {/* WELCOME AREA */}
      <div className="employer-welcome-section">
        <div className="employer-welcome-text">
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p>You have {stats.pendingReview} applications waiting for review.</p>
        </div>
        <div className="action-buttons">
          <button className="btn-create" onClick={() => navigate("/postjob")}>
            <Plus size={20} /> <span>Post a New Job</span>
          </button>
          <button className="btn-secondary-outline" onClick={() => navigate("/employer-dashboard/manage-listings")}>
            Manage Listings
          </button>
        </div>
      </div>

      {/* STATS AREA */}
      <div className="employer-stat-grid-modern">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="employer-stat-card-v2"
            onClick={() => navigate(card.path, { state: { filter: card.filter } })}
          >
            <div className={`employer-icon-v2 ${card.color}`}>{card.icon}</div>
            <div className="employer-data-v2">
              <h3>{card.val}</h3>
              <span>{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* APPLICATIONS AREA */}
      <section className="employer-applications-section-v3">
        <div className="section-title-v2">
          <h2>Recent Applications</h2>
          <span className="total-badge">{applications.length} TOTAL</span>
        </div>

        <div className="employer-listing-grid-v3 auto-height" style={{ marginTop: '20px' }}>
          {applications.length === 0 ? (
            <div className="employer-empty-state-v2" style={{ gridColumn: '1 / -1' }}>
              <div className="employer-empty-icon-circle"><Users size={32} /></div>
              <h2>No Applicants Yet</h2>
              <p>Your listings are active. Once workers apply, they will show up here.</p>
            </div>
          ) : (
            applications.slice(0, 4).map((app) => (
              <div key={app._id} className="employer-modern-list-card">
                <div className="employer-card-status-indicator">
                  <div className={`status-tag ${app.status?.toLowerCase()}`}>
                    {app.status}
                  </div>
                </div>

                <div className="employer-card-body-v3">
                  <div className="employer-list-icon-bg">
                    {app.workerDetails?.profileImage ? (
                      <img src={app.workerDetails.profileImage} alt={app.workerName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      app.workerName?.[0] || <Users size={20} />
                    )}
                  </div>
                  <div className="employer-list-details-v3">
                    <h3>{app.workerName}</h3>
                    <div className="employer-list-meta-v3">
                      <span><Briefcase size={14} /> {app.jobTitle}</span>
                    </div>
                  </div>
                </div>

                <div className="employer-card-stats-row">
                  <div className="employer-c-stat">
                    <label>Location</label>
                    <span>{app.workerDetails?.location || "N/A"}</span>
                  </div>
                  <div className="employer-c-stat">
                    <label>Applied</label>
                    <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="employer-card-footer-v3">
                  <div className="employer-list-actions-v3" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <button className="employer-act-btn-v3 employer-view" onClick={() => setSelectedApp(app)} style={{ flex: 1, gap: '8px', padding: '0 12px' }}>
                      <Eye size={16} /> Details
                    </button>
                    {app.status === "Pending" && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="employer-act-btn-v3 employer-check" onClick={() => handleStatusUpdate(app._id, "Accepted")}>
                          <Check size={18} />
                        </button>
                        <button className="employer-act-btn-v3 employer-delete" onClick={() => handleStatusUpdate(app._id, "Rejected")}>
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* WORKER DETAILS POPUP */}
      {selectedApp && (
        <div className="popup-overlay" onClick={() => setSelectedApp(null)}>
          <div className="inline-popup employer-worker-modal-v3" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <div className="popup-title">
                <Award size={20} color="var(--primary-blue)" />
                <h3>Worker Full Details</h3>
              </div>
              <button className="popup-close" onClick={() => setSelectedApp(null)}><X size={18} /></button>
            </div>

            <div className="worker-details-content">
              <div className="employer-w-header-v3">
                <div className="employer-w-avatar-v3">
                  {selectedApp.workerDetails?.profileImage ? (
                    <img src={selectedApp.workerDetails.profileImage} alt={selectedApp.workerName} />
                  ) : (
                    <span>{selectedApp.workerName?.[0]}</span>
                  )}
                </div>
                <div className="employer-w-title-v3">
                  <h2>{selectedApp.workerName}</h2>
                  <p>Applied for {selectedApp.jobTitle}</p>
                </div>
              </div>

              <div className="employer-w-grid-v3">
                <div className="employer-w-item-v3">
                  <label><Phone size={14} /> Phone</label>
                  <p>{selectedApp.workerDetails?.phone || selectedApp.workerPhone || "N/A"}</p>
                </div>
                <div className="employer-w-item-v3">
                  <label><Mail size={14} /> Email</label>
                  <p>{selectedApp.workerDetails?.email || "No email"}</p>
                </div>
                <div className="employer-w-item-v3">
                  <label><MapPin size={14} /> Location</label>
                  <p>{selectedApp.workerDetails?.location || selectedApp.location || "N/A"}</p>
                </div>
                <div className="employer-w-item-v3">
                  <label><Calendar size={14} /> Applied Date</label>
                  <p>{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedApp.workerDetails?.skills?.length > 0 && (
                <div className="w-skills-v3">
                  <label>Skills & Expertise</label>
                  <div className="employer-w-skills-pills">
                    {selectedApp.workerDetails.skills.map((s, i) => (
                      <span key={i} className="employer-skill-pill-v3">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApp.workerDetails?.experience && (
                <div className="employer-w-exp-v3">
                  <label>Work Experience</label>
                  <p>{selectedApp.workerDetails.experience}</p>
                </div>
              )}

              <div className="w-message-v3">
                <label>Worker Message</label>
                <div className="employer-message-bubble-v3">
                  {selectedApp.message || "I am ready for the job!"}
                </div>
              </div>
            </div>

            <div className="popup-footer">
              <button className="p-btn-cancel" onClick={() => setSelectedApp(null)}>Close</button>
              {selectedApp.status === "Pending" && (
                <button
                  className="p-btn-save"
                  onClick={() => { handleStatusUpdate(selectedApp._id, "Accepted"); setSelectedApp(null); }}
                  disabled={isActionLoading}
                >
                  Hire Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;