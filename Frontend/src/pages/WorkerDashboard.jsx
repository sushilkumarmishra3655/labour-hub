import { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  Eye, Clock, CheckCircle, XCircle, Search,
  ArrowRight, Briefcase, MapPin, IndianRupee, Filter, Zap,
  ShieldCheck, Crown
} from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import toast from "react-hot-toast";
import api from "../services/api";
import "./WorkerDashboard.css";

const FILTERS = ["All", "Pending", "Accepted", "Rejected"];

const WorkerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    totalApplied: 0,
    pendingJobs: 0,
    acceptedJobs: 0,
    rejectedJobs: 0
  });
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isRoot = location.pathname === "/worker-dashboard" || location.pathname === "/worker-dashboard/";

  useEffect(() => {
    if (!user || !isRoot) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, appsRes, jobsRes] = await Promise.all([
          api.get("/worker/stats"),
          api.get("/worker/applications"),
          api.get("/jobs") // For recommendations
        ]);
        setStats(statsRes.data);
        setApplications(appsRes.data);

        // Simple recommendation logic: Latest 3 jobs matching category or just latest
        const allJobs = jobsRes.data || [];
        const recommended = allJobs
          .filter(j => !appsRes.data.some(a => a.jobId === j._id)) // Not already applied
          .slice(0, 3);
        setRecommendedJobs(recommended);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, isRoot]);

  const totalEarnings = applications
    .filter(a => a.status === 'Accepted')
    .reduce((sum, a) => sum + (Number(a.salary) || 0), 0);

  const profileCompletion = user ? (
    (user.name ? 20 : 0) +
    (user.phone ? 20 : 0) +
    (user.location ? 20 : 0) +
    (user.skills?.length > 0 ? 20 : 0) +
    (user.profileImage ? 20 : 0)
  ) : 0;

  if (!user) return null;

  const statCards = [
    { icon: <Briefcase size={22} />, value: stats.totalApplied, label: "Total Applied", color: "blue" },
    { icon: <CheckCircle size={22} />, value: stats.acceptedJobs, label: "Accepted", color: "green" },
    { icon: <Clock size={22} />, value: stats.pendingJobs, label: "In Review", color: "amber" },
    { icon: <XCircle size={22} />, value: stats.rejectedJobs, label: "Rejected", color: "purple" },
  ];

  return (
    <DashboardLayout>
      {!isRoot ? (
        <Outlet />
      ) : (
        <div className="worker-dashboard worker-dashboard-content-wrapper">
          {/* ── Welcome Header ── */}
          <header className="worker-welcome-section">
            <div className="worker-welcome-text">
              <h1>Welcome back, {user.name.split(' ')[0]} 👋</h1>
              <p>Here's a quick overview of your career activity today.</p>
            </div>
            <div className="worker-header-actions">
              <button className="btn-explore-jobs" onClick={() => navigate("/findwork")}>
                Explore Jobs <Search size={18} />
              </button>
            </div>
          </header>

          {error && <div className="error-banner">{error}</div>}

          {/* ── Modern Stats Grid ── */}
          <section className="worker-stat-grid-modern">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="worker-stat-card-v2 skeleton-pulse">
                  <div className="worker-icon-v2 skeleton-bg"></div>
                  <div className="worker-data-v2">
                    <div className="skeleton-line-title"></div>
                    <div className="skeleton-line-sub"></div>
                  </div>
                </div>
              ))
            ) : (
              statCards.map((s, i) => (
                <div
                  key={i}
                  className="worker-stat-card-v2"
                  onClick={() => {
                    let filterStatus = "All";
                    if (s.label === "Accepted") filterStatus = "Accepted";
                    else if (s.label === "In Review") filterStatus = "Pending";
                    else if (s.label === "Rejected") filterStatus = "Rejected";
                    navigate("/worker-dashboard/applications", { state: { filter: filterStatus } });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`worker-icon-v2 ${s.color}`}>{s.icon}</div>
                  <div className="worker-data-v2">
                    <h3>{s.value}</h3>
                    <span>{s.label}</span>
                  </div>
                </div>
              ))
            )}
          </section>

          <div className="worker-dashboard-new-grid">
            {/* ── Account Status ── */}
            <div className="worker-status-section">
              <div className="section-header-v3">
                <div className="s-h-title">
                  <ShieldCheck size={20} color="var(--primary-blue)" />
                  <h3>Account Status</h3>
                </div>
              </div>
              
              <div className="sidebar-card-v3 career-insights">
                <div className="dashboard-sub-card">
                  <div className="sub-status-header">
                    {user.isPremium ? (
                      <div className="premium-active-tag">
                        <Crown size={14} fill="currentColor" /> Premium Member
                      </div>
                    ) : (
                      <div className="free-plan-tag">Free Plan</div>
                    )}
                  </div>
                  <p className="sub-tagline">
                    {user.isPremium 
                      ? "You have unlimited access to all features." 
                      : "Upgrade to unlock unlimited applications and top placement."}
                  </p>
                  <button 
                    className={user.isPremium ? "btn-manage-sub" : "btn-upgrade-glow"}
                    onClick={() => navigate('/worker-dashboard/profile')}
                  >
                    {user.isPremium ? "Manage Plan" : "Upgrade to Premium"}
                  </button>
                </div>

                <div className="profile-progress-container" style={{ marginTop: '20px' }}>
                  <div className="progress-label">
                    <span>{profileCompletion}% Complete</span>
                    <button onClick={() => navigate('/worker-dashboard/profile')}>Edit Profile</button>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${profileCompletion}%` }}></div>
                  </div>
                </div>
                
                <div className="earnings-preview">
                  <div className="e-label">Estimated Earnings</div>
                  <div className="e-value">₹ {totalEarnings.toLocaleString()}</div>
                  <div className="e-footer">From {stats.acceptedJobs} Successful Jobs</div>
                </div>
              </div>
            </div>

            {/* ── Jobs for You ── */}
            <div className="worker-jobs-section">
              <div className="section-header-v3">
                <div className="s-h-title">
                  <Zap size={20} color="#f59e0b" />
                  <h3>Jobs For You</h3>
                </div>
                <button className="s-h-link" onClick={() => navigate("/findwork")}>
                  Browse All <ArrowRight size={14} />
                </button>
              </div>

              <div className="sidebar-card-v3 recommended-section">
                <div className="recommended-list">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <div key={i} className="r-item-skeleton skeleton-pulse"></div>)
                  ) : recommendedJobs.length > 0 ? (
                    recommendedJobs.map(job => (
                      <div key={job._id} className="recommended-item" onClick={() => navigate(`/job/${job._id}`)}>
                        <div className="r-item-icon">{job.title?.[0]}</div>
                        <div className="r-item-info">
                          <h5>{job.title}</h5>
                          <span>₹{job.wage} • {job.location}</span>
                        </div>
                        <ArrowRight size={14} className="r-arrow" />
                      </div>
                    ))
                  ) : (
                    <div className="worker-empty-state-small">
                      <p>No recommendations yet.</p>
                      <button onClick={() => navigate("/findwork")}>Find Jobs</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default WorkerDashboard;