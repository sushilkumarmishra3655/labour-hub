import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./ApplyJobModal.css";

const ApplyJobModal = ({ show, onClose, job }) => {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  // ❗ safety
  if (!show || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔐 login check
    if (!user || !user.isLoggedIn) {
      toast.error("Please login first to apply");
      navigate("/login", {
        state: { from: window.location.pathname },
      });
      return;
    }

    // 🔐 role check
    if (user.role !== "worker") {
      toast.error("Only workers can apply");
      return;
    }

    // 🔥 Backend ready application object
    const newApplication = {
      // job data
      jobId: job._id, // 🔥 important change
      jobTitle: job.title,
      location: job.location,
      wage: job.wage,

      // worker data
      workerId: user.id,
      workerName: form.name || user.name || "Worker",
      workerPhone: form.phone || user.phone || "No Phone",

      // employer data
      employerId: job.employerId,
      employerName: job.employerName || "Employer",
      employerPhone: job.contact || "N/A",

      message: form.message,
      status: "Pending",
      createdAt: Date.now(),
    };

    try {

      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newApplication),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Application failed");
        return;
      }

      toast.success("Applied successfully!");

      // reset form
      setForm({
        name: "",
        phone: "",
        message: "",
      });

      onClose();

    } catch (error) {

      console.log(error);
      toast.error("Server error");

    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3 className="appjob-h3">Apply for {job.title}</h3>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <textarea
            placeholder="Message (optional)"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="apply-btn">
              Apply
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;