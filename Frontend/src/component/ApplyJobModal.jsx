import React, { useState, useContext } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import "./ApplyJobModal.css";

const ApplyJobModal = ({ show, onClose, job }) => {
  const { addApplication } = useContext(ApplicationContext);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  if (!show) return null;

const handleSubmit = (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user")); 
  // assume logged-in worker

  addApplication({
    id: Date.now(),

    jobTitle: job.title,
    location: job.location,
    wage: job.wage,

    workerId: user?.id,
    workerName: form.name,
    workerPhone: form.phone,

    employerId: job.employerId,

    message: form.message,
    status: "Pending",
  });

  alert("✅ Applied successfully!");
  onClose();
};


  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Apply for {job.title}</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            required
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="tel"
            placeholder="Phone Number"
            required
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <textarea
            placeholder="Message (optional)"
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
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
