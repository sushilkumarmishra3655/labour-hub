import { useContext, useMemo, useState, useEffect } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import { JobContext } from "../context/JobContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Trash2, ShieldCheck, Database, TrendingUp, Briefcase, Users, AlertTriangle } from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import api from "../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { applications } = useContext(ApplicationContext);
  const { jobs, deleteJob } = useContext(JobContext);
  const [usersCount, setUsersCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        // Exclude admins if needed, or just show total
        const nonAdmins = res.data.filter(u => u.role !== "admin");
        setUsersCount(nonAdmins.length);
      } catch (err) {
        console.error("Failed to fetch users count", err);
      }
    };
    fetchUsers();
  }, []);

  const isRoot = location.pathname === "/admin-dashboard" || location.pathname === "/admin-dashboard/";

  const revenue = useMemo(() =>
    applications.filter(a => a.status === "Accepted").reduce((sum, a) => sum + (Number(a.wage) || 0) * 0.10, 0),
    [applications]
  );

  const acceptedApps = applications.filter(a => a.status === "Accepted");
  const pendingApps = applications.filter(a => a.status === "Pending");

  const stats = [
    { icon: <TrendingUp size={18} />, value: `₹${revenue.toFixed(0)}`, label: "Est. Revenue (10%)", color: "purple", path: null },
    { icon: <Users size={18} />, value: usersCount, label: "Total Users", color: "blue", path: "/admin-dashboard/users" },
    { icon: <Briefcase size={18} />, value: jobs.length, label: "Total Jobs", color: "green", path: "/admin-dashboard/jobs" },
    { icon: <Database size={18} />, value: applications.length, label: "Total Apps", color: "amber", path: "/admin-dashboard/applications" },
  ];

  const acceptRate = applications.length
    ? Math.round((acceptedApps.length / applications.length) * 100) : 0;
  const pendingRate = applications.length
    ? Math.round((pendingApps.length / applications.length) * 100) : 0;
  const fillRate = jobs.length && acceptedApps.length
    ? Math.min(100, Math.round((acceptedApps.length / jobs.length) * 100)) : 0;

  return (
    <DashboardLayout>
      {!isRoot ? (
        <Outlet />
      ) : (
        <div className="admin-dashboard admin-dashboard-content-wrapper">

          {/* ── Header ── */}
          <header className="admin-welcome-section">
            <div className="admin-welcome-text">
              <h1>Platform Overview 🛡️</h1>
              <p>Monitor platform activity and manage system operations.</p>
            </div>
            <div className="status-tag active">
              System Healthy
            </div>
          </header>

          {/* ── Stats ── */}
          <section className="admin-stat-grid-modern">
            {stats.map((s, i) => (
              <div 
                key={i} 
                className={`admin-stat-card-v2 ${s.path ? 'clickable' : ''}`}
                onClick={() => s.path && navigate(s.path)}
                style={{ cursor: s.path ? 'pointer' : 'default' }}
              >
                <div className={`admin-icon-v2 ${s.color}`}>{s.icon}</div>
                <div className="admin-data-v2">
                  <h3>{s.value}</h3>
                  <span>{s.label}</span>
                </div>
              </div>
            ))}
          </section>

          {/* ── Two column ── */}
          <div className="admin-content">

            {/* Left — Job Moderation */}
            <div>
              <div className="admin-toolbar-v2" style={{ marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={18} color="var(--primary-blue)" /> Platform Jobs
                </h4>
                <span className="admin-tab-badge">{jobs.length} total</span>
              </div>

              <div className="job-list-v2">
                {jobs.slice(0, 5).map((job, i) => (
                  <div key={job._id || i} className="job-card-v2" style={{ padding: '16px 20px' }}>
                    <div className="job-card-info">
                      <div className="job-meta-box">
                        <h4 style={{ fontSize: '15px' }}>{job.title}</h4>
                        <div className="job-tags" style={{ gap: '12px', fontSize: '12px' }}>
                          <span>📍 {job.location}</span>
                          <span>🏢 {job.employerName || "Employer"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="job-card-right">
                      <button
                        className="act-btn del"
                        onClick={() => deleteJob(job._id || job.id)}
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {jobs.length > 5 && (
                  <button className="btn-secondary-outline" style={{ width: '100%' }} onClick={() => navigate("/admin-dashboard/jobs")}>
                    View all {jobs.length} jobs
                  </button>
                )}
              </div>
            </div>

            {/* Right — Health + Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="admin-stat-card-v2" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--primary-green)" /> Platform Health
                </h4>

                <div className="health-row">
                  <div className="health-row__top" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Acceptance Rate</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-green)' }}>{acceptRate}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${acceptRate}%`, background: 'var(--primary-green)' }} />
                  </div>
                </div>

                <div className="health-row">
                  <div className="health-row__top" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Pending Review</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--clr-pending)' }}>{pendingRate}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pendingRate}%`, background: 'var(--clr-pending)' }} />
                  </div>
                </div>
              </div>

              <div className="admin-stat-card-v2" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--text-main)' }}>Quick Actions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button className="btn-secondary-outline" style={{ marginTop: 0, justifyContent: 'flex-start', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={16} /> Verify New Users
                  </button>
                  <button className="btn-secondary-outline" style={{ marginTop: 0, justifyContent: 'flex-start', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={16} /> Resolve Disputes
                  </button>
                  <button className="btn-secondary-outline" style={{ marginTop: 0, justifyContent: 'flex-start', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--clr-danger)', borderColor: '#fee2e2' }}>
                    <Database size={16} /> System Maintenance
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
