import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Briefcase, FileText, LogOut,
  PlusCircle, ShieldCheck, HardHat, User, Home
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../Layout/DashboardLayout.css";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);

  const menuItems = {
    admin: [
      { name: "Home", path: "/", icon: <Home size={20} /> },
      { name: "Dashboard", path: "/admin-dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "My Profile", path: "/admin-dashboard/profile", icon: <User size={20} /> },
      { name: "Users", path: "/admin-dashboard/users", icon: <Users size={20} /> },
      { name: "Manage Jobs", path: "/admin-dashboard/jobs", icon: <Briefcase size={20} /> },
      { name: "Applications", path: "/admin-dashboard/applications", icon: <FileText size={20} /> }
    ],
    employer: [
      { name: "Home", path: "/", icon: <Home size={20} /> },
      { name: "Dashboard", path: "/employer-dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "My Profile", path: "/employer-dashboard/profile", icon: <User size={20} /> },
      { name: "Post New Job", path: "/postjob", icon: <PlusCircle size={20} /> },
      { name: "Manage Listings", path: "/employer-dashboard/manage-listings", icon: <FileText size={20} /> },
      { name: "Applications", path: "/employer-dashboard/applications", icon: <Users size={20} /> }
    ],
    worker: [
      { name: "Home", path: "/", icon: <Home size={20} /> },
      { name: "Dashboard", path: "/worker-dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "My Profile", path: "/worker-dashboard/profile", icon: <User size={20} /> },
      { name: "Find Work", path: "/findwork", icon: <Briefcase size={20} /> },
      { name: "My Applications", path: "/worker-dashboard/applications", icon: <FileText size={20} /> }
    ]
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : ''} notranslate`}>
      <div className="sidebar-brand">
        <div className="brand-logo-bg">
          <HardHat size={22} color="white" strokeWidth={2.5} />
        </div>
        <h2 className="logo-text">Labour<span>Hub</span></h2>
      </div>

      <nav className="sidebar-menu">
        <span className="menu-label">Main Navigation</span>
        {menuItems[user.role]?.map((item, idx) => (
          <NavLink
            key={`${item.path}-${idx}`}
            to={item.path}
            end
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
        <button className="logout-btn" onClick={logout} style={{ width: '100%', marginTop: '0' }}>
          <LogOut size={18} />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;