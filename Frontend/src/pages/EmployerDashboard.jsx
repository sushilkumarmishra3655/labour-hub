import { useContext, useState } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

const EmployerDashboard = () => {
  const { applications, updateStatus } = useContext(ApplicationContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔐 protect route
  if (!user || !user.isLoggedIn) {
    navigate("/login");
    return null;
  }

  // 🔥 correct filtering
  const receivedApplications =
    user.role === "admin"
      ? applications
      : applications.filter(
          (app) =>
            app.employerId &&
            app.employerId.toString() === user.id.toString()
        );

  const [filter, setFilter] = useState("All");

  // 📊 hired count
  const hiredCount = receivedApplications.filter(
    (app) => app.status === "Accepted"
  ).length;

  // 🔍 filtering + safe sorting
  const filteredApplications =
    (filter === "All"
      ? receivedApplications
      : receivedApplications.filter((app) => app.status === filter)
    ).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Employer Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{receivedApplications.length}</h3>
          <p>Total Applications</p>
        </div>

        <div className="stat-card accepted">
          <h3>{hiredCount}</h3>
          <p>Total Hired</p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="filter-tabs">
        {["All", "Pending", "Accepted", "Rejected"].map((type) => (
          <button
            key={type}
            className={filter === type ? "active-tab" : ""}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* APPLICATION LIST */}
      <div className="dashboard-list">
        {filteredApplications.length === 0 ? (
          <p className="empty-msg">No applications yet</p>
        ) : (
          filteredApplications.map((app) => (
            <div className="dashboard-card" key={app.id}>
              
              <h3>{app.jobTitle || "Job Title"}</h3>
              <p>Job ID: {app.jobId}</p>

              <p>👷 {app.workerName || "Worker"}</p>
              <p>📞 {app.workerPhone || "No phone"}</p>

              <span className={`status ${app.status.toLowerCase()}`}>
                {app.status}
              </span>

              <div className="action-buttons">
                {app.status !== "Accepted" && (
                  <button
                    className="accept-btn"
                    onClick={() => updateStatus(app.id, "Accepted")}
                  >
                    <CheckCircle size={16}/> Accept
                  </button>
                )}

                {app.status !== "Rejected" && (
                  <button
                    className="reject-btn"
                    onClick={() => updateStatus(app.id, "Rejected")}
                  >
                    <XCircle size={16}/> Reject
                  </button>
                )}

                {app.status !== "Pending" && (
                  <button
                    className="reset-btn"
                    onClick={() => updateStatus(app.id, "Pending")}
                  >
                    <RotateCcw size={16}/> Reset
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;