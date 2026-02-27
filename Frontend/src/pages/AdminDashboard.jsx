import { useContext, useState } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import { JobContext } from "../context/JobContext";
import "../layout/DashboardLayout.css";
import { Search, Trash2 } from "lucide-react";

const AdminDashboard = () => {
  const { applications, deleteApplication } = useContext(ApplicationContext);
  const { jobs, deleteJob } = useContext(JobContext);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  if (!applications || !jobs) return null;

  // ===== STATS =====
  const totalApplications = applications.length;
  const totalJobs = jobs.length;

  const accepted = applications.filter(app => app.status === "Accepted").length;
  const rejected = applications.filter(app => app.status === "Rejected").length;
  const pending = applications.filter(app => app.status === "Pending").length;

  // ===== FILTER APPLICATIONS =====
  const filteredApplications = applications
    .filter(app =>
      app.workerName?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(app =>
      statusFilter === "All" ? true : app.status === statusFilter
    )
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  // ===== FILTER JOBS =====
  const filteredJobs = jobs
    .filter(job =>
      job.title?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* ===== STATS ===== */}
      <div className="dashboard-stats">
        <div className="stat-card"><h3>{totalJobs}</h3><p>Total Jobs</p></div>
        <div className="stat-card"><h3>{totalApplications}</h3><p>Total Applications</p></div>
        <div className="stat-card accepted"><h3>{accepted}</h3><p>Accepted</p></div>
        <div className="stat-card rejected"><h3>{rejected}</h3><p>Rejected</p></div>
        <div className="stat-card pending"><h3>{pending}</h3><p>Pending</p></div>
      </div>

      {/* ===== SEARCH + FILTER ===== */}
      <div className="dashboard-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search worker or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="status-dropdown"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Accepted</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* ===== APPLICATIONS ===== */}
      <h2>Recent Applications</h2>

      <div className="dashboard-list">
        {filteredApplications.length === 0 ? (
          <p className="empty-msg">No matching applications</p>
        ) : (
          filteredApplications.map((app) => (
            <div className="dashboard-card" key={app.id}>
              <h3>{app.jobTitle}</h3>
              <p>👷 {app.workerName}</p>
              <p>🏢 Employer: {app.employerName || "N/A"}</p>

              <span className={`status ${app.status.toLowerCase()}`}>
                {app.status}
              </span>

              <button
                className="delete-btn"
                onClick={() => {
                  if (window.confirm("Delete this application?")) {
                    deleteApplication(app.id);
                  }
                }}
              >
                <Trash2 size={16}/> Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* ===== JOBS ===== */}
      <h2 style={{ marginTop: "40px" }}>All Jobs</h2>

      <div className="dashboard-list">
        {filteredJobs.length === 0 ? (
          <p className="empty-msg">No jobs available</p>
        ) : (
          filteredJobs.map((job) => (
            <div className="dashboard-card" key={job.id}>
              <h3>{job.title}</h3>
              <p>📍 {job.location}</p>
              <p>💰 ₹{job.wage}</p>

              <button
                className="delete-btn"
                onClick={() => {
                  if (window.confirm("Delete this job?")) {
                    deleteJob(job.id);
                  }
                }}
              >
                <Trash2 size={16}/> Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;