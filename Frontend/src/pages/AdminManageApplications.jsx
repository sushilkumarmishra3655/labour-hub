import { useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FileText, Search, CheckCircle, XCircle, Trash2, Eye, MapPin, Clock, IndianRupee, Building, X, User, Phone, Mail, Calendar, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import "./AdminDashboard.css";

const FILTERS = ["All", "Pending", "Accepted", "Rejected", "Cancelled"];
const ITEMS_PER_PAGE = 4;

const AdminManageApplications = () => {
  const { user } = useContext(AuthContext);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/applications");
      setApplications(res.data);
    } catch (err) {
      console.error("Applications fetch error:", err);
      setError("Failed to load applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application record?")) return;
    setIsActionLoading(true);
    try {
      await api.delete(`/admin/applications/${id}`);
      setApplications(prev => prev.filter(app => app._id !== id));
      setSelectedApp(null);
    } catch (err) {
      alert("Failed to delete application");
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredApps = useMemo(() => {
    let list = applications;
    if (filter !== "All") {
      list = list.filter(a => a.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.jobTitle?.toLowerCase().includes(q) ||
        a.workerName?.toLowerCase().includes(q) ||
        a.employerName?.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q)
      );
    }
    // Reset page whenever filter or search changes
    setCurrentPage(1);

    return list;
  }, [applications, filter, search]);

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!user) return null;

  return (
    <div className="admin-dashboard admin-dashboard-content-wrapper">
      <header className="admin-welcome-section">
        <div className="admin-welcome-text">
          <h1>Manage Job Applications 📄</h1>
          <p>Monitor and manage worker applications across all job postings.</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* ── Quick Stats ── */}
      <section className="admin-stat-grid-modern" style={{ marginBottom: '32px' }}>
        <div
          className={`admin-stat-card-v2 interactive ${filter === "All" ? "active-stat" : ""}`}
          onClick={() => setFilter("All")}
        >
          <div className="admin-icon-v2 blue"><FileText size={22} /></div>
          <div className="admin-data-v2">
            <h3>{applications.length}</h3>
            <span>Total Apps</span>
          </div>
        </div>
        <div
          className={`admin-stat-card-v2 interactive ${filter === "Pending" ? "active-stat" : ""}`}
          onClick={() => setFilter("Pending")}
        >
          <div className="admin-icon-v2 amber"><Clock size={22} /></div>
          <div className="admin-data-v2">
            <h3>{applications.filter(a => a.status === "Pending").length}</h3>
            <span>Pending</span>
          </div>
        </div>
        <div
          className={`admin-stat-card-v2 interactive ${filter === "Accepted" ? "active-stat" : ""}`}
          onClick={() => setFilter("Accepted")}
        >
          <div className="admin-icon-v2 green"><CheckCircle size={22} /></div>
          <div className="admin-data-v2">
            <h3>{applications.filter(a => a.status === "Accepted").length}</h3>
            <span>Accepted</span>
          </div>
        </div>
        <div
          className={`admin-stat-card-v2 interactive ${filter === "Rejected" ? "active-stat" : ""}`}
          onClick={() => setFilter("Rejected")}
        >
          <div className="admin-icon-v2 red" style={{ background: '#fef2f2', color: '#ef4444' }}><XCircle size={22} /></div>
          <div className="admin-data-v2">
            <h3>{applications.filter(a => a.status === "Rejected").length}</h3>
            <span>Rejected</span>
          </div>
        </div>
      </section>

      <div className="admin-toolbar-v2">
        <div className="admin-search-box-v2">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search by job title, worker, or employer..."
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
                {tab === "All" ? applications.length : applications.filter(a => a.status === tab).length}
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
        ) : filteredApps.length === 0 ? (
          <div className="admin-empty-state-v2">
            <div className="admin-empty-icon-circle">📄</div>
            <h2>No applications found</h2>
            <p>Try refining your search or filters to see more results.</p>
            <button className="btn-secondary-outline" onClick={() => { setFilter("All"); setSearch(""); }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="job-list-v2">
            {paginatedApps.map((app, i) => {
              const statusKey = app.status?.toLowerCase() || "pending";
              return (
                <div
                  key={app._id}
                  className="job-card-v2"
                  style={{ animationDelay: `${i * 30}ms`, cursor: 'pointer' }}
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="job-card-info">
                    <div className={`job-icon-box ${statusKey === 'accepted' ? 'green' : statusKey === 'pending' ? 'amber' : 'rejected'}`}>
                      {app.workerName?.charAt(0).toUpperCase() || "W"}
                    </div>
                    <div className="job-meta-box">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4>{app.jobTitle}</h4>
                        <span className={`status-tag ${statusKey === 'accepted' ? 'approved' : statusKey}`} style={{ fontSize: '10px', height: 'fit-content' }}>
                          {app.status}
                        </span>
                      </div>
                      <div className="job-tags" style={{ marginTop: '4px' }}>
                        <span><User size={14} /> <strong>Worker:</strong> {app.workerName}</span>
                        <span><Building size={14} /> <strong>Employer:</strong> {app.employerName}</span>
                        <span><MapPin size={14} /> {app.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="job-card-right">
                    <span style={{ fontSize: '12px', color: 'var(--primary-blue)', fontWeight: '600', marginRight: '10px' }}>View Details</span>
                    <div className="salary-badge" style={{ marginRight: '16px' }}>
                      <IndianRupee size={14} /> <strong>{app.wage}</strong><span>/day</span>
                    </div>

                    <div className="card-actions">
                      <button
                        className="act-btn del"
                        onClick={(e) => { e.stopPropagation(); handleDelete(app._id); }}
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

        {/* Pagination Controls */}
        {totalPages > 1 && !loading && (
          <div className="admin-pagination-container">
            <div className="admin-segmented-control">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1;
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
                // Handle gaps
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="pagination-ellipsis">...</span>;
                }
                return null;
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Application Details Popup ── */}
      {selectedApp && (
        <div className="popup-overlay" onClick={() => setSelectedApp(null)}>
          <div className="inline-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <div className="popup-title">
                <FileText size={20} color="var(--primary-blue)" />
                <h3>Application Details</h3>
              </div>
              <button className="popup-close" onClick={() => setSelectedApp(null)}><X size={18} /></button>
            </div>

            <div className="worker-details-content">
              <div className="admin-u-header-v3">
                <div className={`admin-u-avatar-v3 worker`}>
                  {selectedApp.workerName?.charAt(0).toUpperCase()}
                </div>
                <div className="admin-u-title-v3">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2>{selectedApp.workerName}</h2>
                    <span className={`status-tag ${selectedApp.status?.toLowerCase() === 'accepted' ? 'approved' : selectedApp.status?.toLowerCase()}`}>{selectedApp.status}</span>
                  </div>
                  <p>Applied for <strong>{selectedApp.jobTitle}</strong> • {new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="admin-u-grid-v3">
                <div className="admin-u-item-v3">
                  <label><User size={14} /> Worker Name</label>
                  <p>{selectedApp.workerName}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><Phone size={14} /> Worker Phone</label>
                  <p>{selectedApp.workerPhone || "N/A"}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><Building size={14} /> Employer Name</label>
                  <p>{selectedApp.employerName}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><Phone size={14} /> Employer Phone</label>
                  <p>{selectedApp.employerPhone || "N/A"}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><MapPin size={14} /> Job Location</label>
                  <p>{selectedApp.location}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><IndianRupee size={14} /> Daily Wage</label>
                  <p>₹{selectedApp.wage} / day</p>
                </div>
                <div className="admin-u-item-v3" style={{ gridColumn: 'span 2' }}>
                  <label><Calendar size={14} /> Application Date</label>
                  <p>{new Date(selectedApp.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedApp.message && (
                <div className="u-exp-v3">
                  <label><MessageSquare size={14} /> Worker's Message</label>
                  <p style={{ lineHeight: '1.6', color: '#475569' }}>{selectedApp.message}</p>
                </div>
              )}
            </div>

            <div className="popup-footer">
              <button className="p-btn-cancel" onClick={() => setSelectedApp(null)}>Close</button>
              <button
                className="p-btn-save"
                onClick={() => handleDelete(selectedApp._id)}
                disabled={isActionLoading}
              >
                {isActionLoading ? "Deleting..." : "Delete Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageApplications;
