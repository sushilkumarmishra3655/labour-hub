import { useContext, useState } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const EmployerDashboard = () => {
  const { applications, updateStatus } = useContext(ApplicationContext);
  const user = JSON.parse(localStorage.getItem("user"));

  const receivedApplications = applications.filter(
    (app) => app.employerId === (user?.id || "employer-demo")
  );

  const [filter, setFilter] = useState("All");

  const pending = receivedApplications.filter(
    (app) => app.status === "Pending"
  ).length;

  const accepted = receivedApplications.filter(
    (app) => app.status === "Accepted"
  ).length;

  const rejected = receivedApplications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const filteredApplications =
    (filter === "All"
      ? receivedApplications
      : receivedApplications.filter((app) => app.status === filter)
    ).sort((a, b) => b.id - a.id);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

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
          🚪 Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{receivedApplications.length}</h3>
          <p>Total Applications</p>
        </div>

        <div className="stat-card pending">
          <h3>{pending}</h3>
          <p>Pending</p>
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

      {/* Filter Tabs */}
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

      {/* Applications Grid */}
      <div className="dashboard-list">
        {filteredApplications.length === 0 ? (
          <p>No applications yet</p>
        ) : (
          filteredApplications.map((app) => (
            <div className="dashboard-card" key={app.id}>
              <h3>{app.jobTitle}</h3>
              <p>👷 {app.workerName}</p>
              <p>📞 {app.workerPhone}</p>

              <span className={`status ${app.status.toLowerCase()}`}>
                {app.status}
              </span>

              <div className="action-buttons">

                {app.status !== "Accepted" && (
                  <button
                    className="accept-btn"
                    onClick={() => updateStatus(app.id, "Accepted")}
                  >
                    Accept
                  </button>
                )}

                {app.status !== "Rejected" && (
                  <button
                    className="reject-btn"
                    onClick={() => updateStatus(app.id, "Rejected")}
                  >
                    Reject
                  </button>
                )}

                {app.status !== "Pending" && (
                  <button
                    className="reset-btn"
                    onClick={() => updateStatus(app.id, "Pending")}
                  >
                    Set Pending
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
