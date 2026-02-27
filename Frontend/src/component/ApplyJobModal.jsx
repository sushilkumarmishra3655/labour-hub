import React, { useState, useContext } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ApplyJobModal.css";

const ApplyJobModal = ({ show, onClose, job }) => {
  const { addApplication } = useContext(ApplicationContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  // ❗ safety
  if (!show || !job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 login check
    if (!user || !user.isLoggedIn) {
      alert("Please login first to apply");
      navigate("/login", {
        state: { from: window.location.pathname },
      });
      return;
    }

    // 🔐 role check
    if (user.role !== "worker") {
      alert("Only workers can apply");
      return;
    }

    // 🔥 final application object
    const newApplication = {
      id: Date.now(),

      // job data
      jobId: job.id,
      jobTitle: job.title,
      location: job.location,
      wage: job.wage,

      // worker data
      workerId: user.id,
      workerName: form.name || user.name || "Worker",
      workerPhone: form.phone || user.phone || "No Phone",

      // employer data (🔥 VERY IMPORTANT FOR DASHBOARD)
      employerId: job.employerId,
      employerName: job.employerName || "Employer",
      employerPhone: job.contact || "N/A",

      message: form.message,
      status: "Pending",
      createdAt: Date.now(),
    };

    addApplication(newApplication);

    alert("✅ Applied successfully!");

    // reset form
    setForm({
      name: "",
      phone: "",
      message: "",
    });

    onClose();
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