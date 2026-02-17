import React, { useState } from "react";
import ApplyJobModal from "./ApplyJobModal";
import { getJobImage } from "../utils/jobImages";

const JobCard = ({ job }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="job-card">

        {/* ✅ IMAGE */}
        <div className="job-image">
          <img
            src={getJobImage(job.title)}
            alt={job.title}
          />
        </div>

        <h3 className="job-title">{job.title}</h3>

        <div className="job-details">
          <p>📍 {job.location}</p>
          <p>💰 ₹{job.wage}</p>
          <p>🛠 {job.jobType}</p>
        </div>

        <button
          className="apply-btn"
          onClick={() => setShowModal(true)}
        >
          Apply Now
        </button>
      </div>

      <ApplyJobModal
        show={showModal}
        onClose={() => setShowModal(false)}
        job={job}
      />
    </>
  );
};

export default JobCard;


