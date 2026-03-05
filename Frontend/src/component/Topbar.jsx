import { Bell, UserCircle } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../Layout/DashboardLayout.css";

const Topbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="topbar">
      <h3 className="page-title">Dashboard</h3>

      <div className="topbar-right">
        <Bell size={20} />
        <div className="user-box">
          <UserCircle size={22} />
          <span>{user?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;