import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  return (
    <>
      {/* 🔥 TOP NAVBAR */}
      <Navbar />

      {/* 🔥 SIDEBAR + MAIN CONTENT */}
      <div className="dashboard-container">
        <Sidebar />

        <div className="dashboard-main">
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
