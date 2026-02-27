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
  FileText
} from "lucide-react";
import "./PostJob.css";

const PostJob = () => {
  const { addJob } = useContext(JobContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    email: "",
    location: "",
    wage: "",
    jobType: "Daily",
    description: "",
  });

  const [success, setSuccess] = useState("");

  // 🔥 handle change common
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user || !user.isLoggedIn) {
      alert("Please login as employer first");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    if (user.role !== "employer") {
      alert("Only employers can post jobs");
      navigate("/FindWork");
      return;
    }

    if (!form.title || !form.location || !form.wage || !form.company || !form.email) {
      alert("Please fill all required fields");
      return;
    }

    const newJob = {
      id: Date.now(),
      ...form,

      // 🔥 CRITICAL DATA
      employerId: user.id,                      // for dashboard filtering
      employerName: user.name || "Employer",   // safe fallback
      contact: user.phone || form.email,       // safe fallback

      createdAt: Date.now(),
    };

    addJob(newJob);

    setSuccess("🎉 Job posted successfully!");

    setForm({
      title: "",
      company: "",
      email: "",
      location: "",
      wage: "",
      jobType: "Daily",
      description: "",
    });

    setTimeout(() => setSuccess(""), 3000);

    // optional redirect
    setTimeout(() => navigate("/employer-dashboard"), 800);
  };

  return (
    <div className="post-wrapper">
      <div className="post-card">
        <h2>Post a Job</h2>

        {/* SUCCESS MESSAGE */}
        {success && <div className="success-box">{success}</div>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <Briefcase size={18} />
            <input
              type="text"
              name="title"
              placeholder="Job Title (e.g. Mason, Electrician)"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <Building2 size={18} />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={form.company}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="Company Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <MapPin size={18} />
            <input
              type="text"
              name="location"
              placeholder="Location (City or Area)"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <IndianRupee size={18} />
            <input
              type="number"
              name="wage"
              placeholder="Daily Wage (₹)"
              value={form.wage}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FileText size={18} />
            <textarea
              name="description"
              placeholder="Job Description (optional)"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <select
            className="select-box"
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
          >
            <option value="Daily">Daily</option>
            <option value="Contract">Contract</option>
          </select>

          <div className="btnn">
            <button type="submit" className="primary-btn">
              Post Job
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