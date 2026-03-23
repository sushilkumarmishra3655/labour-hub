import { useContext, useMemo } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import { JobContext } from "../context/JobContext";
import { Trash2, ShieldCheck, Database, TrendingUp, Briefcase, Users, AlertTriangle } from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import "./Dashboard.css";

const AdminDashboard = () => {
  const { applications } = useContext(ApplicationContext);
  const { jobs, deleteJob } = useContext(JobContext);

  const revenue = useMemo(() =>
    applications.filter(a => a.status === "Accepted").reduce((sum, a) => sum + (Number(a.wage) || 0) * 0.10, 0),
    [applications]
  );

  const acceptedApps = applications.filter(a => a.status === "Accepted");
  const pendingApps  = applications.filter(a => a.status === "Pending");

  const stats = [
    { icon: <TrendingUp  size={18} />, value: `₹${revenue.toFixed(0)}`, label: "Est. Revenue (10%)", color: "purple" },
    { icon: <Briefcase   size={18} />, value: jobs.length,               label: "Total Jobs",         color: "blue"   },
    { icon: <Users       size={18} />, value: applications.length,       label: "Total Applications", color: "green"  },
    { icon: <ShieldCheck size={18} />, value: acceptedApps.length,       label: "Total Hired",        color: "amber"  },
  ];

  const acceptRate = applications.length
    ? Math.round((acceptedApps.length / applications.length) * 100) : 0;
  const pendingRate = applications.length
    ? Math.round((pendingApps.length  / applications.length) * 100) : 0;
  const fillRate = jobs.length && acceptedApps.length
    ? Math.min(100, Math.round((acceptedApps.length / jobs.length) * 100)) : 0;

  return (
    <DashboardLayout>
      <div className="db-page">

        {/* ── Header ── */}
        <div className="db-header">
          <div>
            <p className="db-eyebrow db-eyebrow--purple">Admin Control Center</p>
            <h1 className="db-title">Platform Overview 🛡️</h1>
            <p className="db-subtitle">Monitor platform activity and manage system operations.</p>
          </div>
          <div className="health-badge">
            <span className="health-badge__dot" />
            System Healthy
          </div>
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

        {/* ── Two column ── */}
        <div className="admin-content">

          {/* Left — Job Moderation Table */}
          <div>
            <div className="section-row">
              <h2 className="section-title">
                <Database size={16} style={{ opacity: 0.6 }} /> All Job Postings
              </h2>
              <span className="section-count">{jobs.length} jobs</span>
            </div>

            <div className="table-card">
              {jobs.length === 0 ? (
                <div className="table-empty">No jobs on platform yet.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Employer</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, i) => (
                      <tr key={job.id} style={{ animationDelay: `${i * 30}ms` }}>
                        <td>
                          <div className="td-title">{job.title}</div>
                          <div className="td-sub">₹{job.wage}/day · {job.location}</div>
                        </td>
                        <td>
                          <span className="employer-chip">
                            {(job.employerName || String(job.employerId) || "?")[0]?.toUpperCase()}
                          </span>
                          {job.employerName || `ID: ${job.employerId}`}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="action-btn action-btn--delete"
                            onClick={() => deleteJob(job.id)}
                            title="Delete job"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right — Health + Quick Actions */}
          <div>
            <div className="section-row">
              <h2 className="section-title">
                <ShieldCheck size={16} style={{ opacity: 0.6 }} /> Platform Health
              </h2>
            </div>

            <div className="health-card">
              <div className="health-row">
                <div className="health-row__top">
                  <span className="health-row__label">Acceptance Rate</span>
                  <span className="health-row__pct" style={{ color: "var(--success)" }}>{acceptRate}%</span>
                </div>
                <div className="health-track">
                  <div className="health-fill health-fill--green" style={{ width: `${acceptRate}%` }} />
                </div>
              </div>

              <div className="health-row">
                <div className="health-row__top">
                  <span className="health-row__label">Pending Review</span>
                  <span className="health-row__pct" style={{ color: "var(--warning)" }}>{pendingRate}%</span>
                </div>
                <div className="health-track">
                  <div className="health-fill health-fill--amber" style={{ width: `${pendingRate}%` }} />
                </div>
              </div>

              <div className="health-row">
                <div className="health-row__top">
                  <span className="health-row__label">Jobs Fill Rate</span>
                  <span className="health-row__pct" style={{ color: "var(--accent)" }}>{fillRate}%</span>
                </div>
                <div className="health-track">
                  <div className="health-fill health-fill--blue" style={{ width: `${fillRate}%` }} />
                </div>
              </div>
            </div>

            <div className="section-row">
              <h2 className="section-title">Quick Actions</h2>
            </div>

            <div className="actions-card">
              <button className="quick-action quick-action--outline">
                <ShieldCheck size={15} /> Verify New Users
              </button>
              <button className="quick-action quick-action--outline">
                <AlertTriangle size={15} /> Resolve Disputes
              </button>
              <button className="quick-action quick-action--danger">
                <Database size={15} /> System Maintenance
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
