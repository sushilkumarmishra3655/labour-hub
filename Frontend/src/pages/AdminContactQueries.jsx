import { useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  MessageSquare, Search, Trash2, CheckCircle, Clock, 
  ChevronLeft, ChevronRight, X, Phone, User, Calendar, 
  FileText, Mail, Info
} from "lucide-react";
import api from "../services/api";
import Swal from "sweetalert2";
import "./AdminDashboard.css";

const STATUS_FILTERS = ["All", "Pending", "Reviewed", "Resolved"];
const ITEMS_PER_PAGE = 6;

const AdminContactQueries = () => {
  const { user } = useContext(AuthContext);

  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchQueries = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/contact");
        setQueries(res.data);
      } catch (err) {
        console.error("Queries fetch error:", err);
        setError("Failed to load contact queries.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [user]);

  const filteredQueries = useMemo(() => {
    let list = [...queries];

    // Apply status filter
    if (filter !== "All") {
      list = list.filter(q => q.status === filter);
    }

    // Apply search filter (name or phone)
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(item =>
        item.name?.toLowerCase().includes(q) ||
        item.phone?.toString().includes(q) ||
        item.subject?.toLowerCase().includes(q)
      );
    }

    setCurrentPage(1);
    return list;
  }, [queries, filter, search]);

  const totalPages = Math.ceil(filteredQueries.length / ITEMS_PER_PAGE);
  const paginatedQueries = filteredQueries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleUpdateStatus = async (id, newStatus) => {
    setIsActionLoading(true);
    try {
      const res = await api.patch(`/contact/${id}`, { status: newStatus });
      setQueries(prev => prev.map(q => q._id === id ? res.data : q));
      if (selectedQuery?._id === id) setSelectedQuery(res.data);
      
      Swal.fire({
        title: "Status Updated",
        text: `Query marked as ${newStatus}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteQuery = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/contact/${id}`);
        setQueries(prev => prev.filter(q => q._id !== id));
        setSelectedQuery(null);
        Swal.fire("Deleted!", "Query has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete query", "error");
      }
    }
  };

  if (!user) return null;

  return (
    <div className="admin-dashboard admin-dashboard-content-wrapper">
      <header className="admin-welcome-section">
        <div className="admin-welcome-text">
          <h1>Customer Queries 📬</h1>
          <p>Manage and respond to messages from users to provide support.</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="admin-toolbar-v2">
        <div className="admin-search-box-v2">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search by name, phone or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-segmented-control">
          {STATUS_FILTERS.map(tab => {
            const count = tab === "All" ? queries.length : queries.filter(q => q.status === tab).length;
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

      <main className="main-panel">
        {loading ? (
          <div className="job-list-v2">
             <p>Loading messages...</p>
          </div>
        ) : filteredQueries.length === 0 ? (
          <div className="admin-empty-state-v2">
            <div className="admin-empty-icon-circle">📩</div>
            <h2>No messages found</h2>
            <p>Everything is clear! No user queries matching your criteria.</p>
          </div>
        ) : (
          <div className="job-list-v2">
            {paginatedQueries.map((q, i) => {
              const date = new Date(q.createdAt).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric'
              });

              return (
                <div
                  key={q._id}
                  className="job-card-v2"
                  style={{ animationDelay: `${i * 30}ms`, cursor: 'pointer' }}
                  onClick={() => setSelectedQuery(q)}
                >
                  <div className="job-card-info">
                    <div className={`job-icon-box ${q.status.toLowerCase()}`}>
                       {q.status === "Pending" ? <Clock size={20} /> : <CheckCircle size={20} />}
                    </div>
                    <div className="job-meta-box">
                      <h4>{q.subject || "No Subject"}</h4>
                      <div className="job-tags">
                        <span><User size={14} /> {q.name}</span>
                        <span><Phone size={14} /> {q.phone}</span>
                        <span>📅 {date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="job-card-right">
                    <div className={`status-tag ${q.status.toLowerCase()}`}>
                      {q.status}
                    </div>
                    <div className="card-actions">
                      <button
                        className="act-btn del"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuery(q._id);
                        }}
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

        {totalPages > 1 && !loading && (
          <div className="admin-pagination-container" style={{ marginTop: '20px' }}>
             <div className="admin-segmented-control">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                  <ChevronLeft size={16} />
                </button>
                <button disabled>{currentPage} / {totalPages}</button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                   <ChevronRight size={16} />
                </button>
             </div>
          </div>
        )}
      </main>

      {selectedQuery && (
        <div className="popup-overlay" onClick={() => setSelectedQuery(null)}>
          <div className="inline-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <div className="popup-title">
                <MessageSquare size={20} color="var(--primary-blue)" />
                <h3>Message Details</h3>
              </div>
              <button className="popup-close" onClick={() => setSelectedQuery(null)}><X size={18} /></button>
            </div>

            <div className="worker-details-content">
              <div className="admin-u-header-v3">
                 <div className="admin-u-title-v3">
                    <h2>{selectedQuery.name}</h2>
                    <p>{selectedQuery.phone} • Received on {new Date(selectedQuery.createdAt).toLocaleString()}</p>
                 </div>
              </div>

              <div className="admin-u-grid-v3" style={{ gridTemplateColumns: '1fr' }}>
                <div className="admin-u-item-v3">
                   <label><Info size={14} /> Subject</label>
                   <p style={{ fontWeight: '700', fontSize: '18px' }}>{selectedQuery.subject || "No Subject provided"}</p>
                </div>
                <div className="admin-u-item-v3">
                   <label><FileText size={14} /> Message Content</label>
                   <div style={{ 
                     background: '#f8fafc', 
                     padding: '20px', 
                     borderRadius: '12px', 
                     marginTop: '8px',
                     border: '1px solid #e2e8f0',
                     lineHeight: '1.6',
                     color: '#1e293b'
                   }}>
                     {selectedQuery.message}
                   </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                   <span className={`status-tag ${selectedQuery.status.toLowerCase()}`}>
                     Current Status: {selectedQuery.status}
                   </span>
              </div>
            </div>

            <div className="popup-footer">
              <button className="p-btn-cancel" onClick={() => setSelectedQuery(null)}>Close</button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedQuery.status === "Pending" && (
                  <button 
                    className="p-btn-save" 
                    onClick={() => handleUpdateStatus(selectedQuery._id, "Reviewed")}
                    style={{ background: 'var(--primary-blue)' }}
                  >
                    Mark Reviewed
                  </button>
                )}
                {(selectedQuery.status === "Pending" || selectedQuery.status === "Reviewed") && (
                  <button 
                    className="p-btn-save" 
                    onClick={() => handleUpdateStatus(selectedQuery._id, "Resolved")}
                  >
                    Mark Resolved
                  </button>
                )}
                <button 
                  className="p-btn-cancel" 
                  style={{ color: '#ef4444' }}
                  onClick={() => handleDeleteQuery(selectedQuery._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactQueries;
