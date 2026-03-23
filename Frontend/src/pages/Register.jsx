import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { User, Phone, Lock, Key } from "lucide-react";

const Register = () => {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    role: "",
    password: "",
    adminKey: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const ADMIN_SECRET = "ADMIN@123";

  const validate = () => {

    const e = {};

    if (!form.name) e.name = "Name required";

    if (!/^[0-9]{10}$/.test(form.phone))
      e.phone = "Valid phone required";

    if (!form.gender)
      e.gender = "Select gender";

    if (!form.role)
      e.role = "Select role";

    if (form.password.length < 6)
      e.password = "Min 6 char password";

    if (form.role === "admin" && form.adminKey !== ADMIN_SECRET)
      e.adminKey = "Invalid admin key";

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          gender: form.gender,
          role: form.role,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful");

      navigate("/login");

    } catch (error) {

      console.log(error);
      alert("Server error");

    }

  };
  return (
    <div className="auth-page">
      <div className="auth-card large">

        <h2>Create Account</h2>
        <p className="auth-subtitle">Join Labour Hub</p>

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="form-group">
            <label>Name</label>

            <div className="input-box">
              <User className="auth-input-icon" size={18} />

              <input
                type="text"
                placeholder="Enter full name"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            {errors.name && <small>{errors.name}</small>}
          </div>

          {/* PHONE */}
          <div className="form-group">
            <label>Phone</label>

            <div className="input-box">
              <Phone className="auth-input-icon" size={18} />

              <input
                type="text"
                placeholder="Enter phone number"
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            {errors.phone && <small>{errors.phone}</small>}
          </div>

          {/* GENDER */}
          <div className="form-group">
            <label>Gender</label>

            <select
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {errors.gender && <small>{errors.gender}</small>}
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
              <option value="admin">Admin</option>
            </select>

            {errors.role && <small>{errors.role}</small>}
          </div>

          {/* ADMIN KEY */}
          {form.role === "admin" && (
            <div className="form-group">
              <label>Admin Key</label>

              <div className="input-box">
                <Key className="auth-input-icon" size={18} />

                <input
                  type="password"
                  placeholder="Enter admin key"
                  onChange={(e) =>
                    setForm({ ...form, adminKey: e.target.value })
                  }
                />
              </div>

              {errors.adminKey && <small>{errors.adminKey}</small>}
            </div>
          )}

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>

            <div className="input-box">
              <Lock className="auth-input-icon" size={18} />

              <input
                type="password"
                placeholder="Enter password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {errors.password && <small>{errors.password}</small>}
          </div>

          <button className="auth-btn">
            Create Account
          </button>

        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;