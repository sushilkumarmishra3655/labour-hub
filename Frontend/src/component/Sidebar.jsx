import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, FileText, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../Layout/DashboardLayout.css";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const menuItems = {
    admin: [
      { name: "Dashboard", path: "/admin-dashboard", icon: <LayoutDashboard size={18}/> },
      { name: "Users", path: "/admin-users", icon: <Users size={18}/> },
      { name: "Manage Jobs", path: "/admin-jobs", icon: <Briefcase size={18}/> }
    ],
    employer: [
      { name: "Dashboard", path: "/employer-dashboard", icon: <LayoutDashboard size={18}/> },
      { name: "Post Job", path: "/postjob", icon: <Briefcase size={18}/> },
      { name: "My Jobs", path: "/employer-jobs", icon: <FileText size={18}/> }
    ],
    worker: [
      { name: "Dashboard", path: "/worker-dashboard", icon: <LayoutDashboard size={18}/> },
      { name: "Find Work", path: "/findwork", icon: <Briefcase size={18}/> },
      { name: "My Applications", path: "/worker-applications", icon: <FileText size={18}/> }
    ]
  };

  return (
    <div className="sidebar">
      <h2 className="logo">Labour Hub</h2>

      <div className="sidebar-menu">
        {menuItems[user.role]?.map((item) => (
          <NavLink key={item.path} to={item.path} className="nav-item">
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      <button className="logout-btn" onClick={logout}>
        <LogOut size={18}/> Logout
      </button>
    </div>
  );
};

export default Sidebar;