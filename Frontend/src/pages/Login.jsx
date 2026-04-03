import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";
import { AuthContext } from "../context/AuthContext";
import { Phone, Lock } from "lucide-react";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isLoggedIn) {
      if (user.role === "worker") navigate("/worker-dashboard", { replace: true });
      else if (user.role === "employer") navigate("/employer-dashboard", { replace: true });
      else if (user.role === "admin") navigate("/admin-dashboard", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const location = useLocation();

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.phone) {
      e.phone = "Phone required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      e.phone = "Enter valid 10 digit number";
    }

    if (!form.password) {
      e.password = "Password required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid phone or password");
        setLoading(false);
        return;
      }

      // ✅ Save user in context
      login(data);

      // ✅ Redirect Based on Role
      if (data.user.role === "worker") {
        navigate("/worker-dashboard", { replace: true });
      } else if (data.user.role === "employer") {
        navigate("/employer-dashboard", { replace: true });
      } else if (data.user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (error) {
      console.log(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card large">

        <h2>Login</h2>
        <p className="auth-subtitle">
          Access your Labour Hub account
        </p>

        <form onSubmit={handleSubmit}>

          {/* PHONE */}
          <div className="form-group">
            <label>Phone</label>

            <div className="input-box">
              <Phone className="auth-input-icon" size={18} />

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

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>

            <div className="input-box">
              <Lock className="auth-input-icon" size={18} />

              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Password"
              />
            </div>

            {errors.password && <small>{errors.password}</small>}
          </div>

          {/* BUTTON */}
          <button className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;