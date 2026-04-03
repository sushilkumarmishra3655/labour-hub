import { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  Eye, Clock, CheckCircle, XCircle, Search,
  ArrowRight, Briefcase, MapPin, IndianRupee, Filter
} from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const isRoot = location.pathname === "/worker-dashboard" || location.pathname === "/worker-dashboard/";

  useEffect(() => {
    if (!user || !isRoot) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, appsRes] = await Promise.all([
          api.get("/worker/stats"),
          api.get("/worker/applications")
        ]);
        setStats(statsRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, isRoot]);

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
              <p>Track your job applications and explore new opportunities.</p>
            </div>
            <button className="btn-create" onClick={() => navigate("/findwork")}>
              Find Work <ArrowRight size={18} />
            </button>
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
                <div key={i} className="worker-stat-card-v2">
                  <div className={`worker-icon-v2 ${s.color}`}>{s.icon}</div>
                  <div className="worker-data-v2">
                    <h3>{s.value}</h3>
                    <span>{s.label}</span>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* ── Search & Filter Toolbar ── */}
          <div className="worker-toolbar-v2">
            <div className="worker-search-box-v2">
              <Search size={18} className="search-icon" />
              <input
                placeholder="Search jobs, companies or location..."
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

          {/* ── Applications Content ── */}
          <main className="main-panel">
            {loading ? (
              <div className="job-list-v2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="job-card-v2 skeleton-pulse">
                    <div className="job-card-info">
                      <div className="job-icon-box skeleton-bg"></div>
                      <div className="job-meta-box">
                        <div className="skeleton-line-title" style={{ width: '150px' }}></div>
                        <div className="skeleton-line-sub" style={{ width: '100px' }}></div>
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
                {filteredApps.map((app) => (
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
                ))}
              </div>
            )}
          </main>
        </div>
      )}
    </DashboardLayout>
  );
};

export default WorkerDashboard;