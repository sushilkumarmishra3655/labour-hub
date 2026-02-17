import React from "react";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import FindWork from "./pages/FindWork";
import PostJob from "./pages/PostJob";
import Contact from "./pages/Contact";
import Login from "./pages/login";
import Register from "./pages/Register";
import AdminUsers from "./pages/AdminUsers";
import ProtectedRoute from "./routes/ProtectedRoute";

//Dashboards
import WorkerDashboard from "./pages/WorkerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";


const App = () => {
  return (

    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/FindWork" element={<FindWork />} />

          <Route path="/PostJob" element={<PostJob />} />

          <Route path="/Contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* dashboarsds  */}

          <Route
            path="/worker-dashboard" element={
              <ProtectedRoute role="worker">
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer-dashboard" element={
              <ProtectedRoute role="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/admin-users" element={<AdminUsers />} />

        </Routes>
      </main>

      <Footer />
    </div>

  );
};

export default App;

