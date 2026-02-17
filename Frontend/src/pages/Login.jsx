import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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

    if (!form.phone) {
      e.phone = "Phone number required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      e.phone = "Enter valid 10 digit number";
    }

    if (!form.password) {
      e.password = "Password required";
    }

    if (form.role === "admin") {
      if (!form.adminKey) {
        e.adminKey = "Admin key required";
      } else if (form.adminKey !== ADMIN_SECRET) {
        e.adminKey = "Invalid admin key";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("No user found, please register");
      return;
    }

    if (storedUser.phone !== form.phone) {
      alert("Invalid phone number");
      return;
    }

    if (storedUser.role !== form.role) {
      alert("Role mismatch!");
      return;
    }

    if (form.role === "admin" && form.adminKey !== ADMIN_SECRET) {
      alert("Invalid admin key");
      return;
    }

    login(storedUser.role);

    alert("Login successful");
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card large">
        <h2>Login</h2>
        <p className="auth-subtitle">
          Access your Labour Hub account
        </p>

        <form onSubmit={handleSubmit}>

          {/* 🔘 ROLE RADIO BUTTONS */}
          <div className="form-group">
            <label className="role-title">Select Role</label>

            <div className="role-radio-clean">

              <label className="radio-clean">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                />
                Admin
              </label>

              <label className="radio-clean">
                <input
                  type="radio"
                  name="role"
                  value="employer"
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                />
                Employer
              </label>

              <label className="radio-clean">
                <input
                  type="radio"
                  name="role"
                  value="worker"
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                />
                Worker
              </label>


            </div>

            {errors.role && <small>{errors.role}</small>}
          </div>

          {/* PHONE */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
            {errors.phone && <small>{errors.phone}</small>}
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            {errors.password && <small>{errors.password}</small>}
          </div>

          {/* 🔐 ADMIN KEY */}
          {form.role === "admin" && (
            <div className="form-group">
              <label>Admin Secret Key</label>
              <input
                type="password"
                placeholder="Enter admin key"
                onChange={(e) =>
                  setForm({ ...form, adminKey: e.target.value })
                }
              />
              {errors.adminKey && <small>{errors.adminKey}</small>}
            </div>
          )}

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
