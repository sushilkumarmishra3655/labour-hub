import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import FindWork from "./pages/FindWork";
import PostJob from "./pages/PostJob";
import Contact from "./pages/Contact";
import Login from "./pages/login";
import Register from "./pages/Register";

import WorkerDashboard from "./pages/WorkerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.includes("dashboard");

  return (
    <>
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

        {/* WORKER */}
        <Route
          path="/worker-dashboard"
          element={
            <ProtectedRoute role="worker">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        {/* EMPLOYER */}
        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute role="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

      {/* Only show Footer on public pages */}
      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default App;