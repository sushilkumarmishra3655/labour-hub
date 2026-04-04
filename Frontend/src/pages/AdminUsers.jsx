import { useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Users, Search, Trash2, ShieldCheck, Briefcase, ChevronLeft, ChevronRight, X, Phone, Mail, MapPin, Calendar, Award } from "lucide-react";
import api from "../services/api";
import "./AdminDashboard.css";

const FILTERS = ["All", "Workers", "Employers"];
const ITEMS_PER_PAGE = 5;

const AdminUsers = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Users fetch error:", err);
        setError("Failed to load users data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const filteredUsers = useMemo(() => {
    // 🚫 Exclude "admin" role from the list entirely
    let list = users.filter(u => u.role !== "admin");

    // Apply role filter
    if (filter !== "All") {
      const matchRole = filter.toLowerCase().replace("s", ""); // 'Workers' -> 'worker'
      list = list.filter(u => u.role === matchRole);
    }

    // Apply search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.phone?.toString().includes(q)
      );
    }

    // Reset page whenever filter or search changes
    setCurrentPage(1);

    return list;
  }, [users, filter, search]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getRoleIcon = (role) => {
    if (role === "admin") return <ShieldCheck size={14} />;
    if (role === "employer") return <Briefcase size={14} />;
    return <Users size={14} />;
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    setIsActionLoading(true);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      setSelectedUser(null);
      alert("User deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!user) return null;

  // Pre-calculate counts so they don't include admins
  const nonAdminList = users.filter(u => u.role !== "admin");

  return (
    <div className="admin-dashboard admin-dashboard-content-wrapper">
      {/* ── Header ── */}
      <header className="admin-welcome-section">
        <div className="admin-welcome-text">
          <h1>User Management 👥</h1>
          <p>View and manage all registered members on Labour Hub.</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* ── Toolbar ── */}
      <div className="admin-toolbar-v2">
        <div className="admin-search-box-v2">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-segmented-control">
          {FILTERS.map(tab => {
            let count = nonAdminList.length;
            if (tab !== "All") {
              const mRole = tab.toLowerCase().replace("s", "");
              count = nonAdminList.filter(u => u.role === mRole).length;
            }

            return (
              <button
                key={tab}
                className={filter === tab ? "active" : ""}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="admin-tab-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Users List ── */}
      <main className="main-panel">
        {loading ? (
          <div className="job-list-v2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="job-card-v2 skeleton-pulse">
                <div className="job-card-info">
                  <div className="job-icon-box skeleton-bg"></div>
                  <div className="job-meta-box">
                    <div className="skeleton-line-title" style={{ width: '150px' }}></div>
                    <div className="skeleton-line-sub" style={{ width: '100px' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-empty-state-v2">
            <div className="admin-empty-icon-circle">🕵️‍♂️</div>
            <h2>No users found</h2>
            <p>Try adjusting your filters or search term to discover more members.</p>
            <button className="btn-secondary-outline" onClick={() => { setFilter("All"); setSearch(""); }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="job-list-v2">
            {paginatedUsers.map((u, i) => {
              const roleKey = u.role || "worker";
              let roleIcon = roleKey === 'employer' ? <Briefcase size={20} /> : <Users size={20} />;

              const joinedDate = u.createdAt
                ? new Date(u.createdAt).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', year: 'numeric'
                })
                : "Unknown";

              return (
                <div 
                  key={u._id} 
                  className="job-card-v2" 
                  style={{ animationDelay: `${i * 30}ms`, cursor: 'pointer' }}
                  onClick={() => setSelectedUser(u)}
                >
                  <div className="job-card-info">
                    <div className={`job-icon-box ${roleKey === 'employer' ? 'green' : 'blue'}`}>
                      {u.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="job-meta-box">
                      <h4>{u.name}</h4>
                      <div className="job-tags">
                        <span><Phone size={14} style={{ opacity: 0.7 }} /> {u.phone}</span>
                        <span>🏷️ {u._id.slice(-8)}</span>
                        <span>📅 {joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="job-card-right">
                    <span style={{ fontSize: '12px', color: 'var(--primary-blue)', fontWeight: '600', marginRight: '10px' }}>View Profile</span>
                    <div className={`status-tag ${roleKey}`}>
                      {roleKey}
                    </div>
                    <div className="card-actions">
                      <button
                        className="act-btn del"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents opening the popup when clicking delete
                          handleDeleteUser(u._id);
                        }}
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && !loading && (
          <div className="admin-toolbar-v2" style={{ marginTop: '24px', justifyContent: 'center' }}>
            <div className="admin-segmented-control">
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
      </main>

      {/* ── User Details Popup ── */}
      {selectedUser && (
        <div className="popup-overlay" onClick={() => setSelectedUser(null)}>
          <div className="inline-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <div className="popup-title">
                <Award size={20} color="var(--primary-blue)" />
                <h3>Full User Profile</h3>
              </div>
              <button className="popup-close" onClick={() => setSelectedUser(null)}><X size={18} /></button>
            </div>

            <div className="worker-details-content">
              <div className="admin-u-header-v3">
                <div className={`admin-u-avatar-v3 ${selectedUser.role}`}>
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div className="admin-u-title-v3">
                  <h2>{selectedUser.name}</h2>
                  <p>{selectedUser.role?.charAt(0).toUpperCase() + selectedUser.role?.slice(1)} • Member since {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="admin-u-grid-v3">
                <div className="admin-u-item-v3">
                  <label><Phone size={14} /> Phone</label>
                  <p>{selectedUser.phone || "N/A"}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><Mail size={14} /> Email</label>
                  <p>{selectedUser.email || "No email linked"}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><MapPin size={14} /> Location / Address</label>
                  <p>{selectedUser.address || selectedUser.location || "N/A"}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label><Calendar size={14} /> Date of Birth</label>
                  <p>{selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : "N/A"}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label>🔑 User ID</label>
                  <p style={{ fontSize: '12px', fontFamily: 'monospace' }}>{selectedUser._id}</p>
                </div>
                <div className="admin-u-item-v3">
                  <label>🛡️ Membership</label>
                  <p>{selectedUser.role === 'employer' ? "Employer Tier" : "Active Worker"}</p>
                </div>
              </div>

              {selectedUser.skills?.length > 0 && (
                <div className="u-skills-v3">
                  <label>Skills & Expertise</label>
                  <div className="admin-u-skills-pills">
                    {selectedUser.skills.map((s, i) => (
                      <span key={i} className="admin-skill-pill-v3">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.experience && (
                <div className="u-exp-v3">
                  <label>Experience Background</label>
                  <p>{selectedUser.experience}</p>
                </div>
              )}
            </div>

            <div className="popup-footer">
              <button className="p-btn-cancel" onClick={() => setSelectedUser(null)}>Close</button>
              <button 
                className="p-btn-save" 
                onClick={() => handleDeleteUser(selectedUser._id)}
                disabled={isActionLoading}
              >
                {isActionLoading ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
