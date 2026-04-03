import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const JobContext = createContext();

const JobProvider = ({ children }) => {

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {

    try {

      const res = await api.get("/jobs");

      setJobs(res.data);

    } catch (err) {

      console.log("Error fetching jobs", err);

    }

  };

  useEffect(() => {

    fetchJobs();

  }, []);

  return (

    <JobContext.Provider value={{ jobs, fetchJobs }}>

      {children}

    </JobContext.Provider>

  );

};

export default JobProvider;