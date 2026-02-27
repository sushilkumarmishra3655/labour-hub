import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";
import { AuthContext } from "../context/AuthContext";
import { Phone, Lock, Key } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 SAFE REDIRECT LOGIC
  const from = location.state?.from;
  const redirectPath = from && from !== "/login" ? from : "/";

  const [form, setForm] = useState({
    phone: "",
    password: "",
    role: "",
    adminKey: "",
  });

  const [errors, setErrors] = useState({});
  const ADMIN_SECRET = "ADMIN@123";

  const validate = () => {
    const e = {};
    if (!form.role) e.role = "Please select role";

    if (!form.phone) e.phone = "Phone required";
    else if (!/^[0-9]{10}$/.test(form.phone)) e.phone = "Enter valid number";

    if (!form.password) e.password = "Password required";

    if (form.role === "admin") {
      if (!form.adminKey) e.adminKey = "Admin key required";
      else if (form.adminKey !== ADMIN_SECRET)
        e.adminKey = "Invalid admin key";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return alert("Please register first");

    if (storedUser.phone !== form.phone)
      return alert("Invalid phone number");

    if (storedUser.role !== form.role)
      return alert("Role mismatch");

    if (form.role === "admin" && form.adminKey !== ADMIN_SECRET)
      return alert("Invalid admin key");

    login(storedUser.role);

    alert("Login successful");

    // 🔥 redirect to previous page
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card large">
        <h2>Login</h2>
        <p className="auth-subtitle">Access your Labour Hub account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Role</label>
            <div className="role-radio-clean">
              {["admin", "employer", "worker"].map((r) => (
                <label key={r} className="radio-clean">
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                  />
                  {r}
                </label>
              ))}
            </div>
            {errors.role && <small>{errors.role}</small>}
          </div>

          <div className="form-group">
            <label>Phone</label>
            <div className="input-box">
              <Phone className="input-icon" size={18} />
              <input
                type="text"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="Enter phone"
              />
            </div>
            {errors.phone && <small>{errors.phone}</small>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-box">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>
            {errors.password && <small>{errors.password}</small>}
          </div>

          {form.role === "admin" && (
            <div className="form-group">
              <label>Admin Key</label>
              <div className="input-box">
                <Key className="input-icon" size={18} />
                <input
                  type="password"
                  value={form.adminKey}
                  onChange={(e) =>
                    setForm({ ...form, adminKey: e.target.value })
                  }
                />
              </div>
              {errors.adminKey && <small>{errors.adminKey}</small>}
            </div>
          )}

          <button className="auth-btn">Login</button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;