import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {

  const { user, loading } = useContext(AuthContext);

  // 🔥 WAIT until user loads
  if (loading) {
    return <div>Loading...</div>; // ya apna loader laga sakte ho
  }

  // ❌ Not logged in
  if (!user?.isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // ❌ Role mismatch
  if (role && user.role !== role && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;