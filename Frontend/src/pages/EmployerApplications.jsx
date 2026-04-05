import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users, Eye, Phone, MapPin, Mail, Award, Calendar, Search, Filter, Briefcase, X, Check, Trash2, User, ChevronLeft, ChevronRight
} from "lucide-react";
import api from "../services/api";
import "./EmployerDashboard.css";

const ITEMS_PER_PAGE = 6;

const EmployerApplications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(location.state?.filter || "All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (location.state?.filter) {
      setSelectedFilter(location.state.filter);
    }
  }, [location.state]);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get("/applications/employer");
      setApplications(res.data);
    } catch (e) {
      console.error("Applications Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleStatusUpdate = async (id, newStatus) => {
    if (isActionLoading) return;
    if (!window.confirm(`Update status to ${newStatus}?`)) return;

    setIsActionLoading(true);
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    } finally {
      setIsActionLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.workerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "All" || app.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <div className="employer-dashboard employer-dashboard-content-wrapper">Loading Applications...</div>;

  return (
    <div className="employer-dashboard employer-dashboard-content-wrapper manage-listings-page">
      {/* 🟢 MODERN HEADER */}
      <header className="employer-welcome-section">
        <div className="employer-welcome-text">
          <h1>Applications Hub <span style={{ fontSize: '24px' }}>📋</span></h1>
          <p>You have {applications.length} applications from workers across all jobs.</p>
        </div>
      </header>

      {/* 🟢 TOOLBAR: SEARCH & FILTERS */}
      <div className="employer-toolbar-v2" style={{ marginBottom: '40px' }}>
        <div className="employer-search-box-v2">
          <div className="search-icon"><Search size={18} /></div>
          <input
            type="text"
            placeholder="Search by worker name or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="employer-segmented-control">
          {["All", "Pending", "Accepted", "Rejected"].map((f) => (
            <button
              key={f}
              className={selectedFilter === f ? "active" : ""}
              onClick={() => setSelectedFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 🟢 MAIN LIST AREA - USING LISTING GRID V3 STYLE */}
      <div className="employer-listing-grid-v3">
        {paginatedApps.length === 0 ? (
          <div className="employer-empty-state-v2" style={{ gridColumn: '1 / -1' }}>
            <div className="employer-empty-icon-circle"><Users size={32} /></div>
            <h2>No applications found</h2>
            <p>Try changing your search or filter settings.</p>
          </div>
        ) : (
          paginatedApps.map((app) => (
            <div key={app._id} className="employer-modern-list-card">
              <div className="employer-card-status-indicator">
                <div className={`status-tag ${app.status?.toLowerCase()}`}>
                  {app.status === 'Pending' ? '⌛ Pending' : 
                   app.status === 'Accepted' ? '✅ Accepted' : '❌ Rejected'}
                </div>
              </div>

              <div className="employer-card-body-v3">
                <div className="employer-list-icon-bg">
                  {app.workerDetails?.profileImage ? (
                    <img src={app.workerDetails.profileImage} alt={app.workerName} style={{ width: '100%', height: '100%', borderRadius: '14px', objectFit: 'cover' }} />
                  ) : (
                    app.workerName?.[0]
                  )}
                </div>
                <div className="employer-list-details-v3">
                  <h3>{app.workerName}</h3>
                  <div className="employer-list-meta-v3">
                    <Briefcase size={14} /> <span>{app.jobTitle}</span>
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
                <div className="employer-list-actions-v3">
                  <button className="employer-act-btn-v3 employer-view" onClick={() => setSelectedApp(app)}>
                    <Eye size={18} /> Details
                  </button>
                  {app.status === "Pending" && (
                    <>
                      <button className="employer-act-btn-v3 employer-check" onClick={() => handleStatusUpdate(app._id, "Accepted")} title="Accept">
                        <Check size={18} />
                      </button>
                      <button className="employer-act-btn-v3 employer-delete" onClick={() => handleStatusUpdate(app._id, "Rejected")} title="Reject">
                        <X size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🟢 PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="admin-pagination-container">
          <div className="employer-segmented-control">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                return (
                  <button
                    key={pageNum}
                    className={currentPage === pageNum ? "active" : ""}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum} className="pagination-ellipsis">...</span>;
              }
              return null;
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

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

export default EmployerApplications;
