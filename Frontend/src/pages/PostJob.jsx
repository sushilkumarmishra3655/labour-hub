import React, { useState, useContext } from "react";
import { JobContext } from "../context/JobContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
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

  const { fetchJobs } = useContext(JobContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation(); // 🔥 added

  const [loading,setLoading] = useState(false);
  const [success,setSuccess] = useState("");
  const [errors,setErrors] = useState({});

  const [form,setForm] = useState({
    title:"",
    company:"",
    email:user?.email || "",
    phone:user?.phone || "",
    location:"",
    wage:"",
    jobType:"Daily",
    category:"Construction",
    workersNeeded:"",
    shift:"Day Shift",
    description:"",
    urgent:false
  });

  const handleChange = (e)=>{
    const {name,value,type,checked} = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const validate = ()=>{
    let err = {};

    if(!form.title) err.title = "Job title required";
    if(!form.company) err.company = "Company required";
    if(!form.location) err.location = "Location required";
    if(!form.wage || form.wage < 100) err.wage = "Minimum ₹100 required";
    if(!form.email || !form.email.includes("@")) err.email = "Valid email required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();

    // 🔥 NOT LOGGED IN → REDIRECT BACK AFTER LOGIN
    if(!user || !user.isLoggedIn){
      navigate("/login", {
        state: { from: location.pathname } // 👈 important
      });
      return;
    }

    // 🔥 ROLE CHECK
    if(user.role !== "employer"){
      alert("Only employers can post jobs");
      navigate("/find-work");
      return;
    }

    if(!validate()) return;

    setLoading(true);

    const newJob = {
      ...form,
      employerId:user._id || user.id,
      employerName:user.name,
      contact:form.phone || form.email,
      createdAt:Date.now()
    };

    try{

      const res = await fetch("http://localhost:5000/api/jobs",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(newJob)
      });

      const data = await res.json();

      if(!res.ok){
        alert(data.message || "Failed to post job");
        setLoading(false);
        return;
      }

      await fetchJobs();

      setSuccess("🎉 Job posted successfully!");

      // 🔥 redirect after success
      setTimeout(()=>{
        navigate("/employer-dashboard");
      },1200);

    }catch(err){
      console.log(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (

    <div className="post-wrapper">

      <div className="post-card">

        <h2>Post a Job</h2>

        {success && <div className="success-box">{success}</div>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <Briefcase size={18}/>
            <input
              type="text"
              name="title"
              placeholder="Job Title *"
              value={form.title}
              onChange={handleChange}
            />
          </div>
          {errors.title && <p className="error-text">{errors.title}</p>}

          <div className="input-group">
            <Building2 size={18}/>
            <input
              type="text"
              name="company"
              placeholder="Company Name *"
              value={form.company}
              onChange={handleChange}
            />
          </div>
          {errors.company && <p className="error-text">{errors.company}</p>}

          <div className="input-group">
            <Mail size={18}/>
            <input
              type="email"
              name="email"
              placeholder="Company Email *"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}

          <div className="input-group">
            <Phone size={18}/>
            <input
              type="text"
              name="phone"
              placeholder="Contact Number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <MapPin size={18}/>
            <input
              type="text"
              name="location"
              placeholder="Location *"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          {errors.location && <p className="error-text">{errors.location}</p>}

          <div className="input-group">
            <IndianRupee size={18}/>
            <input
              type="number"
              name="wage"
              placeholder="Daily Wage (₹)"
              value={form.wage}
              onChange={handleChange}
            />
          </div>
          {errors.wage && <p className="error-text">{errors.wage}</p>}

          <div className="input-group">
            <Layers size={18}/>
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Construction</option>
              <option>Electrician</option>
              <option>Plumber</option>
              <option>Cleaner</option>
              <option>Driver</option>
              <option>Other</option>
            </select>
          </div>

          <div className="input-group">
            <Users size={18}/>
            <input
              type="number"
              name="workersNeeded"
              placeholder="Workers Needed"
              value={form.workersNeeded}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <Clock size={18}/>
            <select name="shift" value={form.shift} onChange={handleChange}>
              <option>Day Shift</option>
              <option>Night Shift</option>
            </select>
          </div>

          <div className="input-group">
            <FileText size={18}/>
            <textarea
              name="description"
              placeholder="Job Description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <label className="urgent-box">
            <input
              type="checkbox"
              name="urgent"
              checked={form.urgent}
              onChange={handleChange}
            />
            🚨 Urgent Hiring
          </label>

          <div className="btn-row">

            <button
              type="submit"
              className={`primary-btn ${loading ? "loading":""}`}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={()=>navigate("/find-work")}
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