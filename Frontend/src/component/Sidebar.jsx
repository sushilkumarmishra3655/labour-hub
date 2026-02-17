import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../Layout/DashboardLayout.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Labour Hub</h2>
      </div>

      <ul className="sidebar-menu">

        {/* 👑 ADMIN DASHBOARD */}
        {user.role === "admin" && (
          <li onClick={() => navigate("/admin-dashboard")}>
            📊 Admin Dashboard
          </li>
        )}

        {/* 🧾 EMPLOYER DASHBOARD */}
        {(user.role === "employer" || user.role === "admin") && (
          <li onClick={() => navigate("/employer-dashboard")}>
            🧾 Employer Dashboard
          </li>
        )}

        {/* 👷 WORKER DASHBOARD */}
        {(user.role === "worker" || user.role === "admin") && (
          <li onClick={() => navigate("/worker-dashboard")}>
            👷 Worker Dashboard
          </li>
        )}

        {/* 🔧 ADMIN EXTRA OPTIONS */}
        {user.role === "admin" && (
          <>
            <li onClick={() => navigate("/admin-jobs")}>
              🗂 Manage Jobs
            </li>
            <li onClick={() => navigate("/admin-applications")}>
              📥 Applications
            </li>
            <li onClick={() => navigate("/admin-users")}>
              👥 Users
            </li>
          </>
        )}

        {/* 🚪 LOGOUT */}
        <li className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;

