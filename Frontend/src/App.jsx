import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "./context/AuthContext";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import FindWork from "./pages/FindWork";
import PostJob from "./pages/PostJob";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetail from "./pages/JobDetail";

import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerApplications from "./pages/WorkerApplications";
import EmployerDashboard from "./pages/EmployerDashboard";
import ManageListings from "./pages/ManageListings";
import EmployerApplications from "./pages/EmployerApplications";
import DashboardLayout from "./Layout/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminManageJobs from "./pages/AdminManageJobs";
import AdminManageApplications from "./pages/AdminManageApplications";
import Profile from "./pages/Profile";

import ProtectedRoute from "./routes/ProtectedRoute";

const ProfileRedirect = () => {
  const { user } = React.useContext(AuthContext);
  if (!user || !user.isLoggedIn) return <Navigate to="/login" replace />;
  // Fallback to worker if role not found somehow
  return <Navigate to={`/${user.role || 'worker'}-dashboard/profile`} replace />;
};

const App = () => {
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.toLowerCase().includes("dashboard") ||
    location.pathname.toLowerCase().includes("jobs");

  return (
    <>
      <Toaster position="bottom-right" />
      {/* Only show Navbar on public pages */}
      {!isDashboardRoute && <Navbar />}

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/FindWork" element={<FindWork />} />
        <Route path="/PostJob" element={<PostJob />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/job/:id" element={<JobDetail />} />


        {/* WORKER */}
        <Route
          path="/worker-dashboard"
          element={
            <ProtectedRoute role="worker">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="applications" element={<WorkerApplications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* EMPLOYER */}
        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute role="employer">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployerDashboard />} />
          <Route path="manage-listings" element={<ManageListings />} />
          <Route path="applications" element={<EmployerApplications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="users" element={<AdminUsers />} />
          <Route path="jobs" element={<AdminManageJobs />} />
          <Route path="applications" element={<AdminManageApplications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* REDIRECTS FOR OLD LINKS */}
        <Route path="/employer-jobs" element={<Navigate to="/employer-dashboard/manage-listings" replace />} />
        <Route path="/profile" element={<ProfileRedirect />} />
      </Routes>

      {/* Only show Footer on public pages */}
      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default App;