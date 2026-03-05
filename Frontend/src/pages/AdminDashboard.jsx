import { useContext, useMemo } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import { JobContext } from "../context/JobContext";
import {
  Trash2,
  ShieldCheck,
  Database,
  TrendingUp,
  Briefcase,
  Users
} from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import "./Dashboard.css";

const AdminDashboard = () => {
  const { applications } = useContext(ApplicationContext);
  const { jobs, deleteJob } = useContext(JobContext);

  /* ================= CALCULATIONS ================= */

  const revenue = useMemo(() => {
    return applications
      .filter(a => a.status === "Accepted")
      .reduce((sum, a) => sum + (Number(a.wage) || 0) * 0.10, 0);
  }, [applications]);

  const acceptedApps = applications.filter(a => a.status === "Accepted");

  /* ================= UI ================= */

  return (
    <DashboardLayout>
      <div className="dashboard-page">

        {/* ===== HEADER ===== */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Admin Control Center 🛡️
            </h1>
            <p className="dashboard-subtitle">
              Monitor platform activity and manage system operations.
            </p>
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="stats-grid">

          <div className="stat-card">
            <TrendingUp size={20}/>
            <div>
              <h3 className="Stats-card-h3">₹{revenue.toFixed(0)}</h3>
              <p>Estimated Revenue (10%)</p>
            </div>
          </div>

          <div className="stat-card">
            <Briefcase size={20}/>
            <div>
              <h3 className="Stats-card-h3">{jobs.length}</h3>
              <p>Total Jobs</p>
            </div>
          </div>

          <div className="stat-card success">
            <Users size={20}/>
            <div>
              <h3 className="Stats-card-h3">{applications.length}</h3>
              <p>Total Applications</p>
            </div>
          </div>

          <div className="stat-card warning">
            <ShieldCheck size={20}/>
            <div>
              <h3 className="Stats-card-h3">{acceptedApps.length}</h3>
              <p>Total Hired</p>
            </div>
          </div>

        </div>

        {/* ===== CONTENT ===== */}
        <div className="dashboard-content">

          {/* ===== LEFT: JOB MODERATION ===== */}
          <section>
            <h2 className="section-title">
              <Database size={18}/> All Job Postings
            </h2>

            {jobs.length === 0 && (
              <div className="empty-state">
                No jobs available.
              </div>
            )}

            {jobs.length > 0 && (
              <div className="dashboard-card table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Employer</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.map(job => (
                      <tr key={job.id}>
                        <td>{job.title}</td>
                        <td>
                          {job.employerName || `ID: ${job.employerId}`}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => deleteJob(job.id)}
                          >
                            <Trash2 size={14}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ===== RIGHT: PLATFORM HEALTH ===== */}
          <section>
            <h2 className="section-title">
              <ShieldCheck size={18}/> Platform Health
            </h2>

            <div className="dashboard-card">

              <h4>Quick Actions</h4>

              <div className="admin-actions">
                <button className="btn btn-outline">
                  Verify New Users
                </button>

                <button className="btn btn-outline">
                  Resolve Disputes
                </button>

                <button className="btn btn-danger">
                  System Maintenance
                </button>
              </div>

            </div>
          </section>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;