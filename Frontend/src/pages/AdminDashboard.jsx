import { useContext, useState } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import { JobContext } from "../context/JobContext";
import "../layout/DashboardLayout.css";

const AdminDashboard = () => {
  const { applications, deleteApplication } = useContext(ApplicationContext);
  const { jobs, deleteJob } = useContext(JobContext);

  const [search, setSearch] = useState("");

  const totalApplications = applications.length;
  const totalJobs = jobs.length;

  const accepted = applications.filter(app => app.status === "Accepted").length;
  const rejected = applications.filter(app => app.status === "Rejected").length;
  const pending = applications.filter(app => app.status === "Pending").length;

  const filteredApplications = applications.filter((app) =>
    app.workerName?.toLowerCase().includes(search.toLowerCase())
  );

  const recentApplications = [...filteredApplications]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{totalJobs}</h3>
          <p>Total Jobs</p>
        </div>

        <div className="stat-card">
          <h3>{totalApplications}</h3>
          <p>Total Applications</p>
        </div>

        <div className="stat-card accepted">
          <h3>{accepted}</h3>
          <p>Accepted</p>
        </div>

        <div className="stat-card rejected">
          <h3>{rejected}</h3>
          <p>Rejected</p>
        </div>

        <div className="stat-card pending">
          <h3>{pending}</h3>
          <p>Pending</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginTop: "30px", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search by worker name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Applications */}
      <h2>Recent Applications</h2>

      <div className="dashboard-list">
        {recentApplications.length === 0 ? (
          <p>No matching applications</p>
        ) : (
          recentApplications.map((app) => (
            <div className="dashboard-card" key={app.id}>
              <h3>{app.jobTitle}</h3>
              <p>👷 {app.workerName}</p>
              <p>
                Status:
                <span className={`status ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </p>

              <button
                className="delete-btn"
                onClick={() => deleteApplication(app.id)}
              >
                Delete Application
              </button>
            </div>
          ))
        )}
      </div>

      {/* Jobs */}
      <h2 style={{ marginTop: "40px" }}>All Jobs</h2>

      <div className="dashboard-list">
        {jobs.length === 0 ? (
          <p>No jobs available</p>
        ) : (
          jobs.map((job) => (
            <div className="dashboard-card" key={job.id}>
              <h3>{job.title}</h3>
              <p>📍 {job.location}</p>
              <p>💰 ₹{job.wage}</p>

              <button
                className="delete-btn"
                onClick={() => deleteJob(job.id)}
              >
                Delete Job
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


