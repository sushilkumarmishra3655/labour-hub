import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-root">
      {isSidebarOpen && (
        <div className="sidebar-backdrop open" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="dashboard-viewport">
        <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="dashboard-content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;