import { useContext, useState, useMemo } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, IndianRupee, Clock, CheckCircle, XCircle, Search, ArrowRight } from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import "./Dashboard.css";

const FILTERS = ["All", "Pending", "Accepted", "Rejected"];

const WorkerDashboard = () => {
  const { applications } = useContext(ApplicationContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  if (!user) return null;

  const myApps = useMemo(() =>
    applications.filter(app => app.workerId?.toString() === user.id?.toString()),
    [applications, user.id]
  );

  const earnings = useMemo(() =>
    myApps.filter(a => a.status === "Accepted").reduce((sum, a) => sum + (Number(a.wage) || 0), 0),
    [myApps]
  );

  const filteredApps = useMemo(() => {
    let list = filter === "All" ? myApps : myApps.filter(a => a.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.jobTitle?.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q) ||
        a.employerName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [myApps, filter, search]);

  const stats = [
    { icon: <IndianRupee size={18} />, value: `₹${earnings.toLocaleString("en-IN")}`, label: "Total Earnings",   color: "blue" },
    { icon: <CheckCircle  size={18} />, value: myApps.filter(a => a.status === "Accepted").length, label: "Jobs Accepted",  color: "green" },
    { icon: <Clock        size={18} />, value: myApps.filter(a => a.status === "Pending").length,  label: "Pending",        color: "amber" },
    { icon: <XCircle      size={18} />, value: myApps.filter(a => a.status === "Rejected").length, label: "Rejected",       color: "red" },
  ];

  return (
    <DashboardLayout>
      <div className="db-page">

        {/* ── Header ── */}
        <div className="db-header">
          <div>
            <p className="db-eyebrow db-eyebrow--blue">Welcome back</p>
            <h1 className="db-title">{user.name} 👋</h1>
            <p className="db-subtitle">Track your applications and manage your work journey.</p>
          </div>
          <button className="btn btn--primary" onClick={() => navigate("/findwork")}>
            Find Work <ArrowRight size={15} />
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`stat-card__icon stat-card__icon--${s.color}`}>{s.icon}</div>
              <div>
                <div className="stat-card__value">{s.value}</div>
                <div className="stat-card__label">{s.label}</div>
              </div>
              <div className={`stat-card__bar stat-card__bar--${s.color}`} />
            </div>
          ))}
        </div>

        {/* ── Section row: title + search ── */}
        <div className="section-row">
          <h2 className="section-title">
            <Clock size={16} style={{ opacity: 0.6 }} /> Recent Applications
          </h2>
          <div className="search-wrap">
            <Search size={14} color="#94a3b8" />
            <input
              placeholder="Search jobs, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div className="tabs-row">
          {FILTERS.map(tab => {
            const count = tab === "All" ? myApps.length : myApps.filter(a => a.status === tab).length;
            return (
              <button
                key={tab}
                className={`tab-btn ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Application cards ── */}
        {filteredApps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <div className="empty-state__title">No applications found</div>
            <div className="empty-state__sub">Try a different filter or search term</div>
          </div>
        ) : (
          <div className="app-grid">
            {filteredApps.map((app, i) => {
              const statusKey = app.status?.toLowerCase();
              return (
                <div key={app.id} className="app-card" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="app-card__top">
                    <span className={`badge badge--${statusKey}`}>
                      <span className="badge__dot" />
                      {app.status}
                    </span>
                    <span className="app-card__wage">
                      ₹{app.wage}<span>/day</span>
                    </span>
                  </div>

                  <h3 className="app-card__title">{app.jobTitle}</h3>

                  <div className="app-card__meta">
                    <span>📍 {app.location}</span>
                    <span>🏢 {app.employerName || "Employer"}</span>
                  </div>

                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => navigate(`/job/${app.jobId}`)}
                  >
                    <Eye size={14} /> View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;
