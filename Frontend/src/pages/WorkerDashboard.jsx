import { useContext, useState, useMemo } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import "./Dashboard.css";

const WorkerDashboard = () => {
  const { applications } = useContext(ApplicationContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  if (!user) return null;

  /* ================= FILTER APPLICATIONS ================= */

  const myApps = useMemo(() => {
    return applications.filter(
      (app) => app.workerId?.toString() === user.id?.toString()
    );
  }, [applications, user.id]);

  const earnings = useMemo(() => {
    return myApps
      .filter((a) => a.status === "Accepted")
      .reduce((sum, a) => sum + (Number(a.wage) || 0), 0);
  }, [myApps]);

  const filteredApps =
    filter === "All"
      ? myApps
      : myApps.filter((a) => a.status === filter);

  /* ================= UI ================= */

  return (
    <DashboardLayout>
      <div className="dashboard-page">

        {/* ===== HEADER ===== */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Hello, {user.name} 👋
            </h1>
            <p className="dashboard-subtitle">
              Manage your job applications and track your earnings.
            </p>
          </div>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/findwork")}
          >
            Find Work
          </button>
        </div>

        {/* ===== STATS ===== */}
        <div className="stats-grid">

          <div className="stat-card">
            <IndianRupee size={20} />
            <div>
              <h3 className="Stats-card-h3">₹{earnings}</h3>
              <p>Total Earnings</p>
            </div>
          </div>

          <div className="stat-card success">
            <CheckCircle size={20} />
            <div>
              <h3 className="Stats-card-h3">{myApps.filter(a => a.status === "Accepted").length}</h3>
              <p>Jobs Accepted</p>
            </div>
          </div>

          <div className="stat-card warning">
            <Clock size={20} />
            <div>
              <h3 className="Stats-card-h3">{myApps.filter(a => a.status === "Pending").length}</h3>
              <p>Pending Applications</p>
            </div>
          </div>

          <div className="stat-card danger">
            <XCircle size={20} />
            <div>
              <h3 className="Stats-card-h3">{myApps.filter(a => a.status === "Rejected").length}</h3>
              <p>Rejected</p>
            </div>
          </div>

        </div>

        {/* ===== FILTER TABS ===== */}
        <h2 className="section-title">
          <Clock size={18}/> Recent Applications
        </h2>

        <div className="tabs">
          {["All", "Pending", "Accepted", "Rejected"].map((tab) => (
            <button
              key={tab}
              className={`tab ${filter === tab ? "active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ===== APPLICATION LIST ===== */}
        <div className="dashboard-list">

          {filteredApps.length === 0 && (
            <div className="empty-state">
              No applications found.
            </div>
          )}

          {filteredApps.map((app) => (
            <div className="dashboard-card" key={app.id}>

              <div className="card-top">
                <span
                  className={`badge badge-${app.status.toLowerCase()}`}
                >
                  {app.status}
                </span>

                <span className="wage">
                  ₹{app.wage}
                </span>
              </div>

              <h3 className="job-title">
                {app.jobTitle}
              </h3>

              <p className="job-meta">
                📍 {app.location}
              </p>

              <p className="job-meta">
                🏢 {app.employerName || "Employer"}
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navigate(`/job/${app.jobId}`)}
              >
                <Eye size={16}/> View Details
              </button>

            </div>
          ))}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;