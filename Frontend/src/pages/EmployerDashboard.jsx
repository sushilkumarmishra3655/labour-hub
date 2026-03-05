import { useContext, useMemo } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import { JobContext } from "../context/JobContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  Briefcase,
  Check,
  X,
  Clock,
  TrendingUp
} from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import "./Dashboard.css";

const EmployerDashboard = () => {
  const { applications, updateStatus } = useContext(ApplicationContext);
  const { jobs } = useContext(JobContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  /* ================= FILTER DATA ================= */

  const myPostedJobs = useMemo(() => {
    if (user.role === "admin") return jobs;

    return jobs.filter(
      j => j.employerId?.toString() === user.id?.toString()
    );
  }, [jobs, user.id, user.role]);

  const myApps = useMemo(() => {
    if (user.role === "admin") return applications;

    return applications.filter(
      app => app.employerId?.toString() === user.id?.toString()
    );
  }, [applications, user.id, user.role]);

  const pendingApps = myApps.filter(a => a.status === "Pending");
  const acceptedApps = myApps.filter(a => a.status === "Accepted");

  /* ================= UI ================= */

  return (
    <DashboardLayout>
      <div className="dashboard-page">

        {/* ===== HEADER ===== */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Employer Console 🏢
            </h1>
            <p className="dashboard-subtitle">
              Manage job postings and review applications.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/postjob")}
          >
            <Plus size={18} /> Post New Job
          </button>
        </div>

        {/* ===== STATS ===== */}
        <div className="stats-grid">

          <div className="stat-card">
            <Briefcase size={20} />
            <div>
              <h3 className="Stats-card-h3">{myPostedJobs.length}</h3>
              <p>Active Jobs</p>
            </div>
          </div>

          <div className="stat-card warning">
            <Clock size={20} />
            <div>
              <h3 className="Stats-card-h3">{pendingApps.length}</h3>
              <p>New Applicants</p>
            </div>
          </div>

          <div className="stat-card success">
            <Users size={20} />
            <div>
              <h3 className="Stats-card-h3">{acceptedApps.length}</h3>
              <p>Total Hired</p>
            </div>
          </div>

          <div className="stat-card">
            <TrendingUp size={20} />
            <div>
              <h3 className="Stats-card-h3">{myApps.length}</h3>
              <p>Total Applications</p>
            </div>
          </div>

        </div>

        {/* ===== CONTENT SPLIT ===== */}
        <div className="dashboard-content">

          {/* ===== LEFT: JOB MANAGEMENT ===== */}
          <section>
            <h2 className="section-title">
              <Briefcase size={18} /> Your Posted Jobs
            </h2>

            {myPostedJobs.length === 0 && (
              <div className="empty-state">
                No jobs posted yet.
              </div>
            )}

            {myPostedJobs.map(job => (
              <div className="dashboard-card job-card" key={job.id}>

                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-meta">
                    ₹{job.wage} • {job.location}
                  </p>
                </div>

                <button
                  className="btn btn-outline"
                  onClick={() => navigate(`/job/${job.id}`)}
                >
                  Edit
                </button>

              </div>
            ))}
          </section>

          {/* ===== RIGHT: APPLICANT REVIEW ===== */}
          <section>
            <h2 className="section-title">
              <Users size={18} /> Pending Reviews
            </h2>

            {pendingApps.length === 0 && (
              <div className="empty-state">
                No new applicants.
              </div>
            )}

            {pendingApps.map(app => (
              <div className="dashboard-card" key={app.id}>

                <h3 className="job-title">{app.workerName}</h3>
                <p className="job-meta">
                  Applied for: {app.jobTitle}
                </p>

                <div className="btn-group">
                  <button
                    className="btn btn-success"
                    onClick={() => updateStatus(app.id, "Accepted")}
                  >
                    <Check size={16} /> Hire
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => updateStatus(app.id, "Rejected")}
                  >
                    <X size={16} /> Reject
                  </button>
                </div>

              </div>
            ))}
          </section>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;