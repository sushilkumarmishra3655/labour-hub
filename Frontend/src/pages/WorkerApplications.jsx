import { useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  Eye, Search, Briefcase, MapPin, IndianRupee, 
  Calendar, Zap, Clock, CheckCircle, XCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./WorkerDashboard.css";

const FILTERS = ["All", "Pending", "Accepted", "Rejected"];

const WorkerApplications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/worker/applications");
        setApplications(res.data);
      } catch (err) {
        console.error("Applications fetch error:", err);
        setError("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const handleCancelApplication = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this application?")) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/applications/${id}`);
      if (res.data.success) {
        setApplications(prev => prev.filter(app => app._id !== id));
        setSelectedApp(null);
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel application.");
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
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update application.");
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

  return (
    <div className="worker-dashboard-content-wrapper">
      <header className="worker-welcome-section">
        <div className="worker-welcome-text">
          <h1>My Applications 📋</h1>
          <p>Manage all your job requests and track their status.</p>
        </div>
      </header>

      {/* ── Toolbar: Search & Filters ── */}
      <div className="worker-toolbar-v2">
        <div className="worker-search-box-v2">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search applications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="worker-segmented-control">
          {FILTERS.map(tab => (
            <button
              key={tab}
              className={filter === tab ? "active" : ""}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="worker-app-grid-v3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="worker-premium-card-v3 skeleton-pulse">
               <div style={{ height: '220px' }}></div>
            </div>
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="worker-empty-state-v2">
          <div className="worker-empty-icon-circle">🔍</div>
          <h2>No applications found</h2>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="worker-app-grid-v3">
          {filteredApps.map((app) => (
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
                       <p className="m-section-text">{selectedApp.description || "The employer hasn't provided a detailed description."}</p>
                    </div>

                    <div className="modal-section-v3">
                       <div className="m-section-header-row">
                          <label className="m-section-label">Your Application Message</label>
                          {selectedApp.status === "Pending" && !isEditing && (
                             <button className="m-edit-btn" onClick={() => { setIsEditing(true); setEditedMessage(selectedApp.message || ""); }}>
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
                                <span>{new Date(selectedApp.appliedAt).toLocaleTimeString()}</span>
                             </div>
                          </div>
                          <div className={`m-timeline-item ${selectedApp.status !== "Pending" ? "active" : ""}`}>
                             <div className={`m-timeline-icon ${selectedApp.status === 'Accepted' ? 'success' : selectedApp.status === 'Rejected' ? 'danger' : ''}`}>
                                {selectedApp.status === 'Accepted' ? <CheckCircle size={14} /> : 
                                 selectedApp.status === 'Rejected' ? <XCircle size={14} /> : <Zap size={14} />}
                             </div>
                             <div className="m-timeline-info">
                                <strong>Application {selectedApp.status}</strong>
                                <span>Status updated by Employer</span>
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
    </div>
  );
};

export default WorkerApplications;
