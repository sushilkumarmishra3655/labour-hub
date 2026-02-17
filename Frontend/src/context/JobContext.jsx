// ye code jab backend ban jayega tab use hoga backend se data lene ke liye

/*import React, { createContext, useState } from "react";

// context create
export const JobContext = createContext();

// provider component
const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  const addJob = (job) => {
    setJobs((prevJobs) => [...prevJobs, job]);
  };

//   return (
    <JobContext.Provider value={{ jobs, addJob }}>
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider; */


// ye local storage me save karne ke liye hai
import React, { createContext, useState, useEffect } from "react";

export const JobContext = createContext();

const JobProvider = ({ children }) => {

  // 👇 localStorage se initial data
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem("jobs");
    return savedJobs ? JSON.parse(savedJobs) : [];
  });

  // ✅ Add Job
  const addJob = (job) => {
    setJobs((prev) => [...prev, job]);
  };

  // ✅ Delete Job
  const deleteJob = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (confirmDelete) {
      setJobs((prev) => prev.filter((job) => job.id !== id));
    }
  };

  // 👇 jab jobs change ho, localStorage me save karo
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  return (
    <JobContext.Provider value={{ jobs, addJob, deleteJob }}>
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;


