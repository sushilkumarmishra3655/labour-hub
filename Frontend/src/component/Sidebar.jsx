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

        {/* ================= ADMIN ================= */}
        {user.role === "admin" && (
          <>
            <li onClick={() => navigate("/admin-dashboard")}>📊 Dashboard</li>
            <li onClick={() => navigate("/admin-users")}>👥 Users</li>
            <li onClick={() => navigate("/admin-jobs")}>🧾 Manage Jobs</li>
            <li onClick={() => navigate("/admin-applications")}>👷 Applications</li>
          </>
        )}

        {/* ================= EMPLOYER ================= */}
        {user.role === "employer" && (
          <>
            <li onClick={() => navigate("/employer-dashboard")}>📊 Dashboard</li>
            <li onClick={() => navigate("/postjob")}>➕ Post Job</li>
            <li onClick={() => navigate("/employer-jobs")}>📄 My Jobs</li>
            <li onClick={() => navigate("/employer-applications")}>👷 Applications</li>
          </>
        )}

        {/* ================= WORKER ================= */}
        {user.role === "worker" && (
          <>
            <li onClick={() => navigate("/worker-dashboard")}>📊 Dashboard</li>
            <li onClick={() => navigate("/findwork")}>🔎 Find Work</li>
            <li onClick={() => navigate("/worker-applications")}>📄 My Applications</li>
          </>
        )}

        {/* ===== LOGOUT (sabke liye common) ===== */}
        <li className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;


