import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;