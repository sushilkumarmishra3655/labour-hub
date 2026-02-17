import React, { useContext } from "react";
import "./FindWork.css";
import JobCard from "../component/JobCard";
import { JobContext } from "../context/JobContext";

const FindWork = () => {
  const { jobs } = useContext(JobContext);

  return (
    <div className="find-work-page">
      <div className="find-work-header">
        <h1>Find Work</h1>
        <p>Find daily wage jobs near you</p>
      </div>

      {jobs.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          No jobs posted yet
        </p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindWork;

