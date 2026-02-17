import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
    password: "",
    adminKey: ""   // 🔐 NEW
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // 🔐 SECRET ADMIN KEY
  const ADMIN_SECRET = "ADMIN@123";

  const validate = () => {
    const e = {};

    if (!form.name) e.name = "Name is required";

    if (!form.phone) {
      e.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      e.phone = "Enter valid 10 digit phone number";
    }

    if (!form.role) e.role = "Please select a role";

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 6) {
      e.password = "Minimum 6 characters required";
    }

    // 🔥 ADMIN KEY VALIDATION
    if (form.role === "admin") {
      if (!form.adminKey) {
        e.adminKey = "Admin key is required";
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

    // 🔐 extra safety
    if (form.role === "admin" && form.adminKey !== ADMIN_SECRET) {
      alert("Invalid admin key");
      return;
    }

    const userData = {
      id: Date.now(),
      name: form.name,
      phone: form.phone,
      role: form.role,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    alert("Registration successful");
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card large">
        <h2>Create Account</h2>
        <p className="auth-subtitle">
          Join Labour Hub and get started
        </p>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            {errors.name && <small>{errors.name}</small>}
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

          {/* ROLE */}
          <div className="form-group">
            <label>Select Role</label>
            <select
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="">Choose role</option>
              <option value="worker">Worker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option> {/* 🔥 added */}
            </select>
            {errors.role && <small>{errors.role}</small>}
          </div>

          {/* 🔐 ADMIN KEY FIELD */}
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

          <button type="submit" className="auth-btn">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
