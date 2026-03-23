import React, { createContext, useState, useEffect } from "react";

export const JobContext = createContext();

const JobProvider = ({ children }) => {

  const [jobs,setJobs] = useState([]);

  const fetchJobs = async ()=>{

    try{

      const res = await fetch("http://localhost:5000/api/jobs");

      const data = await res.json();

      setJobs(data);

    }catch(err){

      console.log("Error fetching jobs",err);

    }

  };

  useEffect(()=>{

    fetchJobs();

  },[]);

  return (

    <JobContext.Provider value={{ jobs, fetchJobs }}>

      {children}

    </JobContext.Provider>

  );

};

export default JobProvider;