import React, { useState, useContext } from "react";
import { JobContext } from "../context/JobContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Building2,
  Mail,
  FileText,
  Users,
  Clock,
  Phone,
  Layers
} from "lucide-react";
import "./PostJob.css";

const PostJob = () => {
  const { addJob } = useContext(JobContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    company: "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: "",
    wage: "",
    jobType: "Daily",
    category: "Construction",
    workersNeeded: "",
    shift: "Day",
    description: "",
    urgent: false,
  });

  // handle change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // validation
  const validate = () => {
    let err = {};

    if (!form.title) err.title = "Job title required";
    if (!form.company) err.company = "Company required";
    if (!form.location) err.location = "Location required";
    if (!form.wage || form.wage < 100) err.wage = "Minimum ₹100 required";
    if (!form.email.includes("@")) err.email = "Valid email required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user || !user.isLoggedIn) {
      alert("Please login as employer first");
      navigate("/login");
      return;
    }

    if (user.role !== "employer") {
      alert("Only employers can post jobs");
      navigate("/FindWork");
      return;
    }

    if (!validate()) return;

    setLoading(true);

    const newJob = {
      id: Date.now(),
      ...form,
      employerId: user.id,
      employerName: user.name,
      contact: form.phone || form.email,
      createdAt: Date.now(),
    };

    addJob(newJob);

    setTimeout(() => {
      setLoading(false);
      setSuccess("🎉 Job posted successfully!");
      navigate("/employer-dashboard");
    }, 1200);
  };

  return (
    <div className="post-wrapper">
      <div className="post-card">
        <h2>Post a Job</h2>

        {success && <div className="success-box">{success}</div>}

        <form onSubmit={handleSubmit}>

          {/* Job Title */}
          <div className="input-group">
            <Briefcase size={18} />
            <input
              type="text"
              name="title"
              placeholder="Job Title *"
              value={form.title}
              onChange={handleChange}
            />
          </div>
          {errors.title && <p className="error-text">{errors.title}</p>}

          {/* Company */}
          <div className="input-group">
            <Building2 size={18} />
            <input
              type="text"
              name="company"
              placeholder="Company Name *"
              value={form.company}
              onChange={handleChange}
            />
          </div>
          {errors.company && <p className="error-text">{errors.company}</p>}

          {/* Email */}
          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="Company Email *"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* Phone */}
          <div className="input-group">
            <Phone size={18} />
            <input
              type="text"
              name="phone"
              placeholder="Contact Number (optional)"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="input-group">
            <MapPin size={18} />
            <input
              type="text"
              name="location"
              placeholder="Location *"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          {errors.location && <p className="error-text">{errors.location}</p>}

          {/* Wage */}
          <div className="input-group">
            <IndianRupee size={18} />
            <input
              type="number"
              name="wage"
              placeholder="Daily Wage (₹) *"
              value={form.wage}
              onChange={handleChange}
            />
          </div>
          {errors.wage && <p className="error-text">{errors.wage}</p>}
          <p className="helper-text">Typical daily wages range ₹300 – ₹1200</p>

          {/* Category */}
          <div className="input-group">
            <Layers size={18} />
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Construction</option>
              <option>Electrician</option>
              <option>Plumber</option>
              <option>Cleaner</option>
              <option>Driver</option>
              <option>Other</option>
            </select>
          </div>

          {/* Workers Needed */}
          <div className="input-group">
            <Users size={18} />
            <input
              type="number"
              name="workersNeeded"
              placeholder="Workers Needed"
              value={form.workersNeeded}
              onChange={handleChange}
            />
          </div>

          {/* Shift */}
          <div className="input-group">
            <Clock size={18} />
            <select name="shift" value={form.shift} onChange={handleChange}>
              <option>Day Shift</option>
              <option>Night Shift</option>
            </select>
          </div>

          {/* Description */}
          <div className="input-group">
            <FileText size={18} />
            <textarea
              name="description"
              placeholder="Job Description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Urgent */}
          <label className="urgent-box">
            <input
              type="checkbox"
              name="urgent"
              checked={form.urgent}
              onChange={handleChange}
            />
            🚨 Urgent Hiring
          </label>

          {/* Buttons */}
          <div className="btn-row">
            <button type="submit" className={`primary-btn ${loading ? "loading" : ""}`}>
              {loading ? "Posting..." : "Post Job"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/FindWork")}
            >
              View Jobs
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PostJob;