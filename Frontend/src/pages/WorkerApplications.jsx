import { useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Eye, Search, Briefcase, MapPin, IndianRupee, Calendar } from "lucide-react";
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
        setError("Failed to load your applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const filteredApps = useMemo(() => {
    let list = applications;
    
    if (filter !== "All") {
      list = list.filter(a => a.status === filter);
    }
    
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
    <div className="worker-dashboard worker-dashboard-content-wrapper">
      {/* ── Header ── */}
      <header className="worker-welcome-section">
        <div className="worker-welcome-text">
          <h1>My Applications 📋</h1>
          <p>View and manage all the jobs you've applied for.</p>
        </div>
        <button className="btn-create" onClick={() => navigate("/findwork")}>
          Find More Work <Briefcase size={18} />
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* ── Toolbar: Search & Filters ── */}
      <div className="worker-toolbar-v2">
        <div className="worker-search-box-v2">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search jobs, location, or company..."
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
              <span className="worker-tab-badge">
                {tab === "All" 
                  ? applications.length 
                  : applications.filter(a => a.status === tab).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Application cards ── */}
      {loading ? (
        <div className="job-list-v2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="job-card-v2 skeleton-pulse">
              <div className="job-card-info">
                <div className="job-icon-box skeleton-bg"></div>
                <div className="job-meta-box">
                  <div className="skeleton-line-title" style={{ width: '180px' }}></div>
                  <div className="skeleton-line-sub" style={{ width: '120px' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="worker-empty-state-v2">
          <div className="worker-empty-icon-circle">📋</div>
          <h2>No applications found</h2>
          <p>Try adjusting your search or filters to see more results.</p>
          <button className="btn-secondary-outline" onClick={() => { setFilter("All"); setSearch(""); }}>
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="job-list-v2">
          {filteredApps.map((app) => {
            const dateStr = app.appliedAt 
              ? new Date(app.appliedAt).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })
              : "Unknown date";

            return (
              <div key={app._id} className="job-card-v2">
                <div className="job-card-info">
                  <div className="job-icon-box">
                    <Briefcase size={20} />
                  </div>
                  <div className="job-meta-box">
                    <h4>{app.jobTitle}</h4>
                    <div className="job-tags">
                      <span><MapPin size={14} /> {app.location}</span>
                      <span>🏢 {app.company || "Direct Employer"}</span>
                      <span><Calendar size={14} /> Applied: {dateStr}</span>
                    </div>
                  </div>
                </div>

                <div className="job-card-right">
                  <div className="salary-badge">
                    <IndianRupee size={14} /> <strong>{app.salary}</strong><span>/day</span>
                  </div>
                  <div className={`status-tag ${app.status?.toLowerCase()}`}>
                    {app.status}
                  </div>
                  <div className="card-actions">
                    <button
                      className="act-btn worker-edit"
                      onClick={() => navigate(`/job/${app.jobId}`)}
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default WorkerApplications;
