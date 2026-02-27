import React, { useContext, useState } from "react";
import { JobContext } from "../context/JobContext";
import JobCard from "../component/JobCard";
import { 
  Search, LayoutGrid, HardHat, Paintbrush, 
  Zap, Droplets, Hammer, Users, Factory, Pickaxe 
} from "lucide-react"; 
import "./FindWork.css";

const FindWork = () => {
  const { jobs } = useContext(JobContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // 1. Added all your fields here with matching icons
  const categories = [
    { name: "All", icon: <LayoutGrid size={20} /> },
    { name: "Construction", icon: <HardHat size={20} /> },
    { name: "Labour", icon: <Users size={20} /> },
    { name: "Mason", icon: <Pickaxe size={20} /> },
    { name: "Painter", icon: <Paintbrush size={20} /> },
    { name: "Electrician", icon: <Zap size={20} /> },
    { name: "Plumber", icon: <Droplets size={20} /> },
    { name: "Carpenter", icon: <Hammer size={20} /> },
    { name: "Factory Helper", icon: <Factory size={20} /> },
  ];

  // 2. FIXED FILTER LOGIC (Case-Insensitive)
  const filteredJobs = jobs.filter((job) => {
    // Search filter
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter (Matches "Construction" with "construction")
    const matchesCategory = 
      activeCategory === "All" || 
      job.jobType?.toLowerCase() === activeCategory.toLowerCase() ||
      job.category?.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="find-work-page">
      <div className="find-work-header">
        <h1>Find Your Next Work</h1>
        <p>Real jobs, Daily pay, Nearby.</p>
        
        <div className="search-container">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search city or job..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Category Bar for many items */}
      <div className="category-filter-container">
        <div className="category-filter">
          {categories.map((cat) => (
            <button 
              key={cat.name}
              className={`cat-btn ${activeCategory === cat.name ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <div className="cat-icon-wrapper">{cat.icon}</div>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="results-container">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">
            <Users size={48} />
            <h3>No {activeCategory !== "All" ? activeCategory : ""} jobs available right now</h3>
            <p>Try searching in a different city or category.</p>
          </div>
        ) : (
          <div className="job-list">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindWork;