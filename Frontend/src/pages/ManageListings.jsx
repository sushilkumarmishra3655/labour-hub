import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Plus, MapPin, IndianRupee, Clock, Trash2, Edit3, X, Check, Save, Search, Users, AlertCircle, Briefcase, Filter, ChevronLeft, ChevronRight, Navigation, Loader
} from "lucide-react";
import api from "../services/api";
import useCurrentLocation from "../hooks/useCurrentLocation";
import "./EmployerDashboard.css";

const ManageListings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myPostedJobs, setMyPostedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "", location: "", wage: "", jobType: "", description: "", workersNeeded: 1, shift: "", urgent: false
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const { fetchLocation, locLoading, locError } = useCurrentLocation();

  const handleUseCurrentLocation = () => {
    fetchLocation((address) => {
      setEditForm(prev => ({ ...prev, location: address }));
    });
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/employer");
      setMyPostedJobs(res.data);
    } catch (e) {
      console.error("Manage Listings Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  const handleDeleteJob = async (id) => {
    if (!window.confirm("ARE YOU SURE? This will remove the listing and all its applications.")) return;
    try {
      setMyPostedJobs(myPostedJobs.filter(j => j._id !== id));
      await api.delete(`/jobs/${id}`);
    } catch (err) {
      console.error("Delete Error:", err);
      fetchJobs();
    }
  };

  const openPopup = (job) => {
    setEditingJob(job);
    setEditForm({
      title: job.title || "",
      location: job.location || "",
      wage: job.wage || "",
      jobType: job.jobType || "Daily Wager",
      description: job.description || "",
      workersNeeded: job.workersNeeded || 1,
      shift: job.shift || "Day Shift",
      urgent: job.urgent || false
    });
  };

  const closePopup = () => {
    setEditingJob(null);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await api.put(`/jobs/${editingJob._id}`, editForm);
      setMyPostedJobs(myPostedJobs.map(j => j._id === editingJob._id ? res.data.job : j));
      setEditingJob(null);
      alert("✅ Listing updated successfully!");
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update job.");
    } finally {
      setIsUpdating(false);
    }
  };

  // FILTER LOGIC
  const filteredJobs = myPostedJobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "All" || job.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="employer-dashboard employer-dashboard-content-wrapper">Loading your listings...</div>;

  return (
    <div className="employer-dashboard employer-dashboard-content-wrapper manage-listings-page">
      {/* 🟢 MODERN HEADER */}
      <header className="employer-welcome-section">
        <div className="employer-welcome-text">
          <h1>Management Hub <span style={{ fontSize: '24px' }}>🛠️</span></h1>
          <p>You have {myPostedJobs.length} active posts across all categories.</p>
        </div>
        <button className="btn-create" onClick={() => navigate("/postjob")}>
          <Plus size={20} /> <span>Post Another Job</span>
        </button>
      </header>

      {/* 🟢 TOOLBAR: SEARCH & FILTERS */}
      <div className="employer-toolbar-v2" style={{ marginBottom: '40px' }}>
        <div className="employer-search-box-v2">
          <div className="search-icon"><Search size={18} /></div>
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="employer-segmented-control">
          {["All", "Approved", "Pending", "Rejected"].map((f) => (
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

      {/* 🟢 MAIN LIST AREA */}
      <div className="employer-listing-grid-v3">
        {filteredJobs.length === 0 ? (
          <div className="employer-empty-state-v2" style={{ gridColumn: '1 / -1' }}>
            <div className="employer-empty-icon-circle"><Briefcase size={32} /></div>
            <h2>No listings found</h2>
            <p>Try changing your search or filter settings.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="employer-modern-list-card">
              <div className="employer-card-status-indicator">
                <div className={`status-tag ${job.status?.toLowerCase()}`}>
                  {job.status}
                </div>
                {job.urgent && <span className="employer-urgent-mini"><AlertCircle size={14} /> Urgent</span>}
              </div>

              <div className="employer-card-body-v3">
                <div className="employer-list-icon-bg">
                  {job.title?.[0] || "J"}
                </div>
                <div className="employer-list-details-v3">
                  <h3>{job.title}</h3>
                  <div className="employer-list-meta-v3">
                    <span><MapPin size={14} /> {job.location}</span>
                    <span><IndianRupee size={14} /> ₹{job.wage}/day</span>
                  </div>
                </div>
              </div>

              <div className="employer-card-stats-row">
                <div className="employer-c-stat">
                  <label>Needed</label>
                  <span>{job.workersNeeded || 1} Workers</span>
                </div>
                <div className="employer-c-stat">
                  <label>Shift</label>
                  <span>{job.shift || "Day Shift"}</span>
                </div>
              </div>

              <div className="employer-card-footer-v3">
                <div className="employer-post-date-mini">
                  Posted on {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <div className="employer-list-actions-v3">
                  <button className="employer-act-btn-v3 employer-edit" onClick={() => openPopup(job)}>
                    <Edit3 size={18} />
                  </button>
                  <button className="employer-act-btn-v3 employer-delete" onClick={() => handleDeleteJob(job._id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── HIGH-END EDIT MODAL ── */}
      {editingJob && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="inline-popup employer-worker-modal-v3" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <div className="popup-title">
                <Edit3 size={20} color="var(--primary-blue)" />
                <h3>Refine Job Info</h3>
              </div>
              <button className="popup-close" onClick={closePopup}><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdateJob} className="employer-popup-form">
              <div className="p-form-group">
                <label>Professional Title</label>
                <input
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="p-form-row">
                <div className="p-form-group">
                  <label>Location Area</label>
                  <input
                    value={editForm.location}
                    onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="loc-btn"
                    onClick={handleUseCurrentLocation}
                    disabled={locLoading}
                    style={{ marginTop: '8px' }}
                  >
                    {locLoading ? (
                      <><Loader size={14} className="spin-icon" /> Detecting...</>
                    ) : (
                      <><Navigation size={14} /> Use Current Location</>
                    )}
                  </button>
                  {locError && <small style={{ color: '#ef4444', fontSize: '11px' }}>{locError}</small>}
                </div>
                <div className="p-form-group">
                  <label>Daily Wage (₹)</label>
                  <input
                    type="number"
                    value={editForm.wage}
                    onChange={e => setEditForm({ ...editForm, wage: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="p-form-row">
                <div className="p-form-group">
                  <label>Employment Type</label>
                  <select
                    value={editForm.jobType}
                    onChange={e => setEditForm({ ...editForm, jobType: e.target.value })}
                  >
                    <option value="Daily Wager">Daily Wager</option>
                    <option value="Contract">Contract</option>
                    <option value="Permanent">Permanent</option>
                  </select>
                </div>
                <div className="p-form-group">
                  <label>Workers Required</label>
                  <input
                    type="number"
                    value={editForm.workersNeeded}
                    onChange={e => setEditForm({ ...editForm, workersNeeded: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-form-row">
                <div className="p-form-group">
                  <label>Shift Timing</label>
                  <input
                    type="text"
                    placeholder="e.g. 9 AM - 5 PM"
                    value={editForm.shift}
                    onChange={e => setEditForm({ ...editForm, shift: e.target.value })}
                  />
                </div>
                <div className="p-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px', marginTop: '30px' }}>
                  <input
                    type="checkbox"
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    checked={editForm.urgent}
                    onChange={e => setEditForm({ ...editForm, urgent: e.target.checked })}
                    id="urgent-check"
                  />
                  <label htmlFor="urgent-check" style={{ margin: 0, cursor: 'pointer' }}>Mark as Urgent</label>
                </div>
              </div>

              <div className="p-form-group">
                <label>Tell Workers About the Job</label>
                <textarea
                  rows="3"
                  value={editForm.description}
                  placeholder="Explain exactly what the worker needs to do..."
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>

              <div className="popup-footer">
                <button type="button" className="p-btn-cancel" onClick={closePopup}>Discard</button>
                <button type="submit" className="p-btn-save" disabled={isUpdating}>
                  {isUpdating ? "Syncing..." : <><Save size={18} /> Save & Update</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageListings;
