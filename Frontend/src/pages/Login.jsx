import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { AuthContext } from "../context/AuthContext";
import { Phone, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user?.isLoggedIn) {
      const routes = { worker: "/worker-dashboard", employer: "/employer-dashboard", admin: "/admin-dashboard" };
      navigate(routes[user.role] || "/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        login(data); // Context update
      } else {
        alert(data.message || "Invalid phone or password");
      }
    } catch {
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card narrow">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to manage your profile and job listings.</p>
        </div>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div className="form-group">
            <label>Phone Number</label>
            <div className="input-wrapper">
              <Phone size={18} />
              <input type="text" placeholder="Enter phone" onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input type="password" placeholder="Enter password" onChange={e => setForm({...form, password: e.target.value})} />
            </div>
          </div>

          <button className="auth-btn-main" disabled={loading}>
            {loading ? "Verifying..." : "Login Account"} 
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-footer">New to Labour Hub? <Link to="/register">Register Free</Link></p>
      </div>
    </div>
  );
};

export default Login;