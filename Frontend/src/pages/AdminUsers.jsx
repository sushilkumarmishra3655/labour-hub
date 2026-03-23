import { useState } from "react";
import { Search, Trash2, Shield, ShieldOff, Users } from "lucide-react";
import "./Dashboard.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Ramesh Kumar",   email: "ramesh@gmail.com",   role: "Worker",   status: "Active",  joined: "Jan 2025" },
    { id: 2, name: "Company A",      email: "companya@gmail.com", role: "Employer", status: "Active",  joined: "Feb 2025" },
    { id: 3, name: "Suresh Patel",   email: "suresh@gmail.com",   role: "Worker",   status: "Blocked", joined: "Dec 2024" },
    { id: 4, name: "Admin",          email: "admin@labourhub.in", role: "Admin",    status: "Active",  joined: "Oct 2024" },
    { id: 5, name: "Mehta Builders", email: "mehta@builders.com", role: "Employer", status: "Active",  joined: "Mar 2025" },
  ]);

  const [search, setSearch]         = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = filterRole === "All" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const deleteUser   = (id) => setUsers(users.filter(u => u.id !== id));
  const toggleStatus = (id) => setUsers(users.map(u =>
    u.id === id ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" } : u
  ));

  const roleCounts = {
    All:      users.length,
    Worker:   users.filter(u => u.role === "Worker").length,
    Employer: users.filter(u => u.role === "Employer").length,
    Admin:    users.filter(u => u.role === "Admin").length,
  };

  return (
    <div className="db-page">

      {/* ── Header ── */}
      <div className="db-header">
        <div>
          <p className="db-eyebrow db-eyebrow--purple">Admin Panel</p>
          <h1 className="db-title">User Management</h1>
          <p className="db-subtitle">Monitor, manage and moderate platform users.</p>
        </div>
        <div className="total-chip">
          <Users size={14} /> {users.length} Total Users
        </div>
      </div>

      {/* ── Toolbar: search + role filter ── */}
      <div className="users-toolbar">
        <div className="users-search">
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="tabs-row" style={{ margin: 0 }}>
          {["All", "Worker", "Employer", "Admin"].map(role => (
            <button
              key={role}
              className={`tab-btn ${filterRole === role ? "active" : ""}`}
              onClick={() => setFilterRole(role)}
            >
              {role}
              <span className="tab-count">{roleCounts[role]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="table-card">
        {filteredUsers.length === 0 ? (
          <div className="table-empty">
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
            <div>No users found</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => {
                const roleKey   = u.role.toLowerCase();
                const statusKey = u.status.toLowerCase();
                return (
                  <tr key={u.id} style={{ animationDelay: `${i * 35}ms` }}>

                    {/* User cell */}
                    <td>
                      <div className="user-cell">
                        <div className={`user-avatar user-avatar--${roleKey}`}>
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="user-cell__name">{u.name}</div>
                          <div className="user-cell__email">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      <span className={`role-badge role-badge--${roleKey}`}>
                        <span className="role-badge__dot" />
                        {u.role}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="td-sub">{u.joined}</td>

                    {/* Status */}
                    <td>
                      <span className={`badge badge--${statusKey}`}>
                        {u.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="actions-cell">
                        <button
                          className={`action-btn ${u.status === "Active" ? "action-btn--block" : "action-btn--unblock"}`}
                          onClick={() => toggleStatus(u.id)}
                          title={u.status === "Active" ? "Block user" : "Unblock user"}
                        >
                          {u.status === "Active" ? <ShieldOff size={13} /> : <Shield size={13} />}
                        </button>

                        {u.role !== "Admin" && (
                          <button
                            className="action-btn action-btn--delete"
                            onClick={() => deleteUser(u.id)}
                            title="Delete user"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default AdminUsers;
