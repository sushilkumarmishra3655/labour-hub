import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import {
  User, Phone, Lock, Key, MapPin, Loader,
  Navigation, Mail, Calendar, ShieldCheck
} from "lucide-react";
import useCurrentLocation from "../hooks/useCurrentLocation";

const Register = () => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", dob: "", gender: "",
    role: "", password: "", confirmPassword: "", adminKey: "", address: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { fetchLocation, locLoading, locError } = useCurrentLocation();

  const ADMIN_SECRET = "ADMIN@123";

  // Logic to verify age >= 18
  const checkAge = (dob) => {
    if (!dob) return false;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone = "10-digit phone required";
    if (!form.dob) e.dob = "DOB required"; else if (!checkAge(form.dob)) e.dob = "Must be 18+ years old";
    if (!form.gender) e.gender = "Select gender";
    if (!form.role) e.role = "Select role";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords mismatch";
    if (form.role === "admin" && form.adminKey !== ADMIN_SECRET) e.adminKey = "Invalid Admin Key";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUseCurrentLocation = () => {
    fetchLocation((address) => setForm(prev => ({ ...prev, address })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) { alert("Registration Successful!"); navigate("/login"); }
      else alert("Registration failed. Phone/Email might already exist.");
    } catch { alert("Server error. Please try again later."); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join Labour Hub and discover the right opportunities.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-grid">
          <div className="form-group">
            <label>Full Name</label>
            <div className={`input-wrapper ${errors.name ? 'error-border' : ''}`}>
              <User size={18} />
              <input type="text" placeholder="John Doe" onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            {errors.name && <small className="error-text">{errors.name}</small>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className={`input-wrapper ${errors.email ? 'error-border' : ''}`}>
              <Mail size={18} />
              <input type="email" placeholder="john@example.com" onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            {errors.email && <small className="error-text">{errors.email}</small>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div className={`input-wrapper ${errors.phone ? 'error-border' : ''}`}>
              <Phone size={18} />
              <input type="text" placeholder="10-digit number" onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            {errors.phone && <small className="error-text">{errors.phone}</small>}
          </div>

          <div className="form-group">
            <label>Date of Birth (18+)</label>
            <div className={`input-wrapper ${errors.dob ? 'error-border' : ''}`}>
              <Calendar size={18} />
              <input type="date" onChange={e => setForm({ ...form, dob: e.target.value })} />
            </div>
            {errors.dob && <small className="error-text">{errors.dob}</small>}
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="input-wrapper">
              <select onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Select Role</label>
            <div className="input-wrapper">
              <select onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="">Choose Role</option>
                <option value="worker">Worker</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Your Location</label>
            <div className="address-row">
              <div className="input-wrapper" style={{ flex: 1 }}>
                <MapPin size={18} />
                <input type="text" placeholder="Area, City" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <button type="button" className="detect-btn" onClick={handleUseCurrentLocation} disabled={locLoading}>
                {locLoading ? <Loader className="spin" size={16} /> : <Navigation size={16} />} <span>Detect</span>
              </button>
            </div>
            {locError && <small className="error-text">{locError}</small>}
          </div>

          {form.role === "admin" && (
            <div className="form-group full-width">
              <label>Admin Key</label>
              <div className="input-wrapper">
                <Key size={18} />
                <input type="password" placeholder="Enter key" onChange={e => setForm({ ...form, adminKey: e.target.value })} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className={`input-wrapper ${errors.password ? 'error-border' : ''}`}>
              <Lock size={18} />
              <input type="password" placeholder="Min 6 characters" onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            {errors.password && <small className="error-text">{errors.password}</small>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className={`input-wrapper ${errors.confirmPassword ? 'error-border' : ''}`}>
              <ShieldCheck size={18} />
              <input type="password" placeholder="Repeat password" onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
            </div>
            {errors.confirmPassword && <small className="error-text">{errors.confirmPassword}</small>}
          </div>

          <button type="submit" className="auth-btn-main">Create Account</button>
        </form>
        <p className="auth-footer">Already a member? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Register;