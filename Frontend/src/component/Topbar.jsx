import { Bell, UserCircle, Search } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Layout/DashboardLayout.css";

const Topbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h3 className="page-title">Overview</h3>
        <div className="topbar-breadcrumb">Dashboard / {user?.role}</div>
      </div>

      <div className="topbar-right">
        <div className="icon-action-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </div>

        <div className="user-profile-trigger" onClick={() => navigate(`/${user.role}-dashboard/profile`)} style={{ cursor: 'pointer' }}>
          <div className="user-avatar-circle">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info-text">
            <span className="user-name">{user?.name}</span>
            <span className="user-role-label">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;