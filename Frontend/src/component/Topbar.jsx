import { Bell, UserCircle, Search, Menu } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Layout/DashboardLayout.css";

const Topbar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="hamburger-menu" onClick={toggleSidebar}>
          <Menu size={24} />
        </div>
        <div>
          <h3 className="page-title">Overview</h3>
          <div className="topbar-breadcrumb">Dashboard / {user?.role}</div>
        </div>
      </div>

      <div className="topbar-right">
        <div className="icon-action-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </div>

        <div className="user-profile-trigger" onClick={() => navigate(`/${user.role}-dashboard/profile`)} style={{ cursor: 'pointer' }}>
          <div className="user-avatar-circle" style={user?.profileImage ? { padding: 0, overflow: 'hidden' } : {}}>
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
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