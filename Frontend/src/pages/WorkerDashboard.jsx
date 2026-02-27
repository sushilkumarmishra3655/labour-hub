import { useContext, useState } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye } from "lucide-react";

const WorkerDashboard = () => {
  const { applications } = useContext(ApplicationContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const myApplications =
    user.role === "admin"
      ? applications
      : applications.filter(
          (app) => app.workerId?.toString() === user.id?.toString()
        );

  const [filter, setFilter] = useState("All");

  const filteredApplications =
    (filter === "All"
      ? myApplications
      : myApplications.filter((app) => app.status === filter)
    ).sort((a, b) => b.createdAt - a.createdAt);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <h1 className="dashboard-title">Worker Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

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

      <div className="dashboard-list">
        {filteredApplications.length === 0 ? (
          <p className="empty-msg">No applications yet</p>
        ) : (
          filteredApplications.map((app) => (
            <div className="dashboard-card" key={app.id}>
              <h3>{app.jobTitle}</h3>
              <p>📍 {app.location}</p>
              <p>💰 ₹{app.wage}</p>
              <p>📞 Employer: {app.employerPhone || "N/A"}</p>

              <span className={`status ${app.status.toLowerCase()}`}>
                {app.status}
              </span>

              <button
                className="view-btn"
                onClick={() => navigate(`/job/${app.jobId}`)}
              >
                <Eye size={16}/> View Job
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;