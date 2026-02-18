import Sidebar from "../component/Sidebar";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

