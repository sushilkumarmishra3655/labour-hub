import React, { useContext, useState } from "react";
import { JobContext } from "../context/JobContext";
import JobCard from "../component/JobCard";
import {
  Search, LayoutGrid, HardHat, Paintbrush,
  Zap, Droplets, Hammer, Users, Factory, Pickaxe,
  ChevronLeft, ChevronRight
} from "lucide-react";
import "./FindWork.css";

const FindWork = () => {
  const { jobs } = useContext(JobContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

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

  const filteredJobs = jobs.filter((job) => {

    // SEARCH FILTER
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category?.toLowerCase().includes(searchTerm.toLowerCase());

    // CATEGORY FILTER
    const matchesCategory =
      activeCategory === "All" ||
      job.title?.toLowerCase() === activeCategory.toLowerCase() ||
      job.category?.toLowerCase() === activeCategory.toLowerCase() ||
      job.jobType?.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="find-work-page">
      <div className="find-work-header">
        <h1>Find Your Next Work</h1>
        <p>Real jobs, Daily pay, Nearby.</p>

        <div className="search-container">
          <Search className="search-icon-fw" />
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
            <h3 className="no-jobs-h3">No {activeCategory !== "All" ? activeCategory : ""} jobs available right now</h3>
            <p>Try searching in a different city or category.</p>
          </div>
        ) : (
          <>
            <div className="job-list">
              {paginatedJobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="findwork-pagination-container">
                <div className="findwork-segmented-control">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNum = index + 1;
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                      return (
                        <button
                          key={pageNum}
                          className={currentPage === pageNum ? "active" : ""}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} className="pagination-ellipsis">...</span>;
                    }
                    return null;
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FindWork;