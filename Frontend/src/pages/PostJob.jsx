import React, { useState, useContext } from "react";
import { JobContext } from "../context/JobContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { 
  Briefcase as BriefcaseIcon, 
  MapPin as MapPinIcon, 
  IndianRupee as RupeeIcon, 
  Building2 as CompanyIcon, 
  Mail as MailIcon, 
  FileText as DescriptionIcon, 
  Users as UsersIcon, 
  Clock as ClockIcon, 
  Phone as PhoneIcon, 
  Layers as CategoryIcon,
  AlertTriangle,
  ArrowRight,
  Navigation,
  Loader
} from "lucide-react";
import useCurrentLocation from "../hooks/useCurrentLocation";
import "./PostJob.css";

const PostJob = () => {
  const { fetchJobs } = useContext(JobContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const { fetchLocation, locLoading, locError } = useCurrentLocation();

  const handleUseCurrentLocation = () => {
    fetchLocation((address) => {
      setForm(prev => ({ ...prev, location: address }));
    });
  };

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
    shift: "Day Shift",
    description: "",
    urgent: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const validate = () => {
    let err = {};

    if (!form.title) err.title = "Job title is required";
    if (!form.company) err.company = "Company name is required";
    if (!form.location) err.location = "Location is required";
    if (!form.wage || form.wage < 100) err.wage = "Minimum wage should be ₹100";
    if (!form.email || !form.email.includes("@")) err.email = "Please enter a valid business email";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.isLoggedIn) {
      navigate("/login", {
        state: { from: location.pathname }
      });
      return;
    }

    if (user.role !== "employer") {
      toast.error("Only employers can post jobs");
      navigate("/findwork");
      return;
    }

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await api.post("/jobs", form);

      if (res.status === 201) {
        await fetchJobs();
        setSuccess("🎉 Job posted successfully! Redirecting...");
        toast.success("Job posted successfully!");
        setTimeout(() => {
          navigate("/employer-dashboard");
        }, 1500);
      } else {
        toast.error("Failed to post job");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-wrapper">
      <div className="post-card">
        <div className="card-header">
          <h2>Post a New Job</h2>
          <p className="subtitle">Hire the right talent for your projects quickly and efficiently.</p>
        </div>

        {success && <div className="success-box">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* --- Section 1: General Info --- */}
          <div className="form-section">
            <h3 className="form-section-title">
              <BriefcaseIcon size={20} /> Basic Details
            </h3>
            <div className="form-grid">
              <div className="input-container">
                <label className="input-label">Job Title *</label>
                <div className="input-group">
                  <BriefcaseIcon size={18} />
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Masonry Expert"
                    value={form.title}
                    onChange={handleChange}
                  />
                </div>
                {errors.title && <p className="error-text">{errors.title}</p>}
              </div>

              <div className="input-container">
                <label className="input-label">Company/Business Name *</label>
                <div className="input-group">
                  <CompanyIcon size={18} />
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. Skyline Builders"
                    value={form.company}
                    onChange={handleChange}
                  />
                </div>
                {errors.company && <p className="error-text">{errors.company}</p>}
              </div>
            </div>
          </div>

          {/* --- Section 2: Contact Info --- */}
          <div className="form-section">
            <h3 className="form-section-title">
              <MailIcon size={20} /> Contact Information
            </h3>
            <div className="form-grid">
              <div className="input-container">
                <label className="input-label">Business Email *</label>
                <div className="input-group">
                  <MailIcon size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="contact@company.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="input-container">
                <label className="input-label">Phone Number (Optional)</label>
                <div className="input-group">
                  <PhoneIcon size={18} />
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- Section 3: Job Logistics --- */}
          <div className="form-section">
            <h3 className="form-section-title">
              <ClockIcon size={20} /> Job Logistics & Location
            </h3>
            <div className="form-grid">
              <div className="input-container">
                <label className="input-label">Work Location *</label>
                <div className="input-group">
                  <MapPinIcon size={18} />
                  <input
                    type="text"
                    name="location"
                    placeholder="City, State"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="button"
                  className="loc-btn"
                  onClick={handleUseCurrentLocation}
                  disabled={locLoading}
                >
                  {locLoading ? (
                    <><Loader size={15} className="spin-icon" /> Detecting location...</>
                  ) : (
                    <><Navigation size={15} /> Use Current Location</>
                  )}
                </button>
                {locError && <p className="error-text">{locError}</p>}
                {errors.location && <p className="error-text">{errors.location}</p>}
              </div>

              <div className="input-container">
                <label className="input-label">Daily Wage (₹) *</label>
                <div className="input-group">
                  <RupeeIcon size={18} />
                  <input
                    type="number"
                    name="wage"
                    placeholder="Min 100"
                    value={form.wage}
                    onChange={handleChange}
                  />
                </div>
                {errors.wage && <p className="error-text">{errors.wage}</p>}
              </div>

              <div className="input-container">
                <label className="input-label">Category</label>
                <div className="input-group">
                  <CategoryIcon size={18} />
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="Construction">Construction</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Driver">Driver</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="input-container">
                <label className="input-label">Shift Type</label>
                <div className="input-group">
                  <ClockIcon size={18} />
                  <select name="shift" value={form.shift} onChange={handleChange}>
                    <option value="Day Shift">Day Shift</option>
                    <option value="Night Shift">Night Shift</option>
                    <option value="Full Day">Full Day (9am - 9pm)</option>
                  </select>
                </div>
              </div>

              <div className="input-container">
                <label className="input-label">Workers Needed</label>
                <div className="input-group">
                  <UsersIcon size={18} />
                  <input
                    type="number"
                    name="workersNeeded"
                    placeholder="Quantity"
                    value={form.workersNeeded}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-container" style={{ justifyContent: 'center' }}>
                <label className="urgent-box">
                  <input
                    type="checkbox"
                    name="urgent"
                    checked={form.urgent}
                    onChange={handleChange}
                  />
                  <span className="urgent-text">
                    <AlertTriangle size={18} color="#ef4444" /> Urgent Hiring?
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">
              <DescriptionIcon size={20} /> Job Description & Requirements
            </h3>
            <div className="input-group">
              <DescriptionIcon size={18} style={{ marginTop: '10px', alignSelf: 'flex-start' }} />
              <textarea
                name="description"
                placeholder="Describe the work involved, tools required, and any other specific needs..."
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="btn-row">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/findwork")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`primary-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Posting Job..." : "Publish Job Post"} <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;