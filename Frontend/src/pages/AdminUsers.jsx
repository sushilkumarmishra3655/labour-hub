import { useState } from "react";
import "../Layout/DashboardLayout.css";

const AdminUsers = () => {
  // Demo data (baad me API se aayega)
  const [users, setUsers] = useState([
    { id: 1, name: "Ramesh", email: "ramesh@gmail.com", role: "Worker", status: "Active" },
    { id: 2, name: "Company A", email: "companya@gmail.com", role: "Employer", status: "Active" },
    { id: 3, name: "Suresh", email: "suresh@gmail.com", role: "Worker", status: "Blocked" },
    { id: 4, name: "Admin", email: "admin@gmail.com", role: "Admin", status: "Active" },
  ]);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  // 🔍 Filter + Search logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      filterRole === "All" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  // 🗑 Delete user
  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="dashboard-main">
      <h2>Users Management</h2>

      {/* 🔎 Search + Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="All">All</option>
          <option value="Worker">Workers</option>
          <option value="Employer">Employers</option>
          <option value="Admin">Admins</option>
        </select>
      </div>

      {/* 📋 Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
