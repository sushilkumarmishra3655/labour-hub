import { useContext, useMemo, useState } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import { JobContext } from "../context/JobContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Briefcase, Check, X, Clock, TrendingUp, ChevronRight } from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import "./Dashboard.css";

const EmployerDashboard = () => {
  const { applications, updateStatus } = useContext(ApplicationContext);
  const { jobs } = useContext(JobContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs");

  if (!user) return null;

  const myPostedJobs = useMemo(() =>
    user.role === "admin" ? jobs : jobs.filter(j => j.employerId?.toString() === user.id?.toString()),
    [jobs, user.id, user.role]
  );

  const myApps = useMemo(() =>
    user.role === "admin" ? applications : applications.filter(app => app.employerId?.toString() === user.id?.toString()),
    [applications, user.id, user.role]
  );

  const pendingApps  = myApps.filter(a => a.status === "Pending");
  const acceptedApps = myApps.filter(a => a.status === "Accepted");

  const stats = [
    { icon: <Briefcase  size={18} />, value: myPostedJobs.length, label: "Active Jobs",        color: "blue"   },
    { icon: <Clock      size={18} />, value: pendingApps.length,  label: "Pending Review",     color: "amber"  },
    { icon: <Users      size={18} />, value: acceptedApps.length, label: "Total Hired",        color: "green"  },
    { icon: <TrendingUp size={18} />, value: myApps.length,       label: "Total Applications", color: "purple" },
  ];

  return (
    <DashboardLayout>
      <div className="db-page">

        {/* ── Header ── */}
        <div className="db-header">
          <div>
            <p className="db-eyebrow db-eyebrow--blue">Employer Console</p>
            <h1 className="db-title">Welcome back, {user.name} 🏢</h1>
            <p className="db-subtitle">Manage your job postings and review incoming applications.</p>
          </div>
          <button className="btn btn--primary" onClick={() => navigate("/postjob")}>
            <Plus size={16} /> Post New Job
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

        {/* ── Tab switcher ── */}
        <div className="tab-switcher">
          <button
            className={`switch-tab ${activeTab === "jobs" ? "active" : ""}`}
            onClick={() => setActiveTab("jobs")}
          >
            <Briefcase size={14} /> Your Jobs
            <span className="switch-tab__pill">{myPostedJobs.length}</span>
          </button>
          <button
            className={`switch-tab ${activeTab === "applicants" ? "active" : ""}`}
            onClick={() => setActiveTab("applicants")}
          >
            <Users size={14} /> Pending Reviews
            {pendingApps.length > 0 && (
              <span className="switch-tab__pill switch-tab__pill--red">{pendingApps.length}</span>
            )}
          </button>
        </div>

        {/* ── Jobs Panel ── */}
        {activeTab === "jobs" && (
          <>
            {myPostedJobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">💼</div>
                <div className="empty-state__title">No jobs posted yet</div>
                <div className="empty-state__sub">Start hiring by posting your first job</div>
                <button className="btn btn--primary" onClick={() => navigate("/postjob")}>
                  <Plus size={14} /> Post a Job
                </button>
              </div>
            ) : (
              <div className="list-panel">
                {myPostedJobs.map((job, i) => (
                  <div key={job.id} className="list-row" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="list-row__left">
                      <div className="list-row__icon list-row__icon--blue">🏗</div>
                      <div>
                        <div className="list-row__title">{job.title}</div>
                        <div className="list-row__meta">📍 {job.location} &nbsp;·&nbsp; ₹{job.wage}/day</div>
                      </div>
                    </div>
                    <div className="list-row__right">
                      <span className="badge badge--active">Active</span>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => navigate(`/job/${job.id}`)}
                      >
                        Edit <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Applicants Panel ── */}
        {activeTab === "applicants" && (
          <>
            {pendingApps.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">✅</div>
                <div className="empty-state__title">All caught up!</div>
                <div className="empty-state__sub">No pending applications to review</div>
              </div>
            ) : (
              <div className="list-panel">
                {pendingApps.map((app, i) => (
                  <div key={app.id} className="list-row" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="list-row__left">
                      <div className="avatar-chip avatar-chip--blue">
                        {app.workerName?.[0]?.toUpperCase() || "W"}
                      </div>
                      <div>
                        <div className="list-row__title">{app.workerName}</div>
                        <div className="list-row__meta">
                          Applied for: <strong>{app.jobTitle}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="list-row__right">
                      <button className="btn btn--success btn--sm" onClick={() => updateStatus(app.id, "Accepted")}>
                        <Check size={14} /> Hire
                      </button>
                      <button className="btn btn--danger btn--sm" onClick={() => updateStatus(app.id, "Rejected")}>
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
