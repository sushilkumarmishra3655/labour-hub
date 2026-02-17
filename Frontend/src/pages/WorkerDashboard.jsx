import { useContext, useState } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const WorkerDashboard = () => {
  const { applications } = useContext(ApplicationContext);
  const user = JSON.parse(localStorage.getItem("user"));

  const myApplications = applications.filter(
    (app) => app.workerId === (user?.id || "worker-demo")
  );

  const [filter, setFilter] = useState("All");

  const accepted = myApplications.filter(
    (app) => app.status === "Accepted"
  ).length;

  const rejected = myApplications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const filteredApplications =
    (filter === "All"
      ? myApplications
      : myApplications.filter((app) => app.status === filter)
    ).sort((a, b) => b.id - a.id);

  // 🔐 Logout logic
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard-page">

      {/* 🔥 HEADER WITH LOGOUT (same as employer) */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Worker Dashboard</h1>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* ===== Stats ===== */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{myApplications.length}</h3>
          <p>Total Applied</p>
        </div>

        <div className="stat-card accepted">
          <h3>{accepted}</h3>
          <p>Accepted</p>
        </div>

        <div className="stat-card rejected">
          <h3>{rejected}</h3>
          <p>Rejected</p>
        </div>
      </div>

      {/* ===== Filter Tabs ===== */}
      <div className="filter-tabs">
        {["All", "Accepted", "Rejected"].map((type) => (
          <button
            key={type}
            className={filter === type ? "active-tab" : ""}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ===== Applications List ===== */}
      <div className="dashboard-list">
        {filteredApplications.length === 0 ? (
          <p>No applications yet</p>
        ) : (
          filteredApplications.map((app) => (
            <div className="dashboard-card" key={app.id}>
              <h3>{app.jobTitle}</h3>
              <p>📍 {app.location}</p>
              <p>💰 ₹{app.wage}</p>

              <span className={`status ${app.status.toLowerCase()}`}>
                {app.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
