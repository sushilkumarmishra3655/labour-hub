import { useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Briefcase, Search, CheckCircle, XCircle, Trash2, Eye, MapPin, Clock, IndianRupee, Building } from "lucide-react";
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
    try {
      await api.patch(`/admin/jobs/${id}/approve`);
      setJobs(prev => prev.map(job =>
        job._id === id ? { ...job, status: "Approved" } : job
      ));
    } catch (err) {
      alert("Failed to approve job");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/admin/jobs/${id}/reject`);
      setJobs(prev => prev.map(job =>
        job._id === id ? { ...job, status: "Rejected" } : job
      ));
    } catch (err) {
      alert("Failed to reject job");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs(prev => prev.filter(job => job._id !== id));
    } catch (err) {
      alert("Failed to delete job");
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
        <div className="admin-stat-card-v2">
          <div className="admin-icon-v2 blue"><Briefcase size={22} /></div>
          <div className="admin-data-v2">
            <h3>{jobs.length}</h3>
            <span>Total Posts</span>
          </div>
        </div>
        <div className="admin-stat-card-v2">
          <div className="admin-icon-v2 amber"><Clock size={22} /></div>
          <div className="admin-data-v2">
            <h3>{jobs.filter(j => j.status === "Pending").length}</h3>
            <span>Pending Review</span>
          </div>
        </div>
        <div className="admin-stat-card-v2">
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
                <div key={job._id} className="job-card-v2" style={{ animationDelay: `${i * 30}ms` }}>
                  <div className="job-card-info">
                    <div className={`job-icon-box ${statusKey}`} style={{
                      background: '#f1f5f9',
                      color: 'var(--primary-blue)'
                    }}>
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
                    <div className="salary-badge" style={{ marginRight: '32px' }}>
                      <IndianRupee size={14} /> <strong>{job.wage}</strong><span>/day</span>
                    </div>

                    <div className="card-actions">
                      {job.status === "Pending" && (
                        <>
                          <button
                            className="act-btn"
                            style={{ color: 'var(--primary-green)', borderColor: 'rgba(34, 197, 94, 0.2)' }}
                            onClick={() => handleApprove(job._id)}
                            title="Approve Listing"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            className="act-btn"
                            style={{ color: 'var(--clr-pending)', borderColor: 'rgba(245, 158, 11, 0.2)' }}
                            onClick={() => handleReject(job._id)}
                            title="Reject Listing"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}

                      <button
                        className="act-btn del"
                        onClick={() => handleDelete(job._id)}
                        title="Delete Permanently"
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
    </div>
  );
};

export default AdminManageJobs;
