import { useEffect, useState } from "react";
import axios from "axios";

function UsersPage() {
  const [dateTime, setDateTime] = useState("");
  const [pendingManagers, setPendingManagers] = useState([]);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("ctps_token");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setDateTime(
        now.toLocaleString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = async () => {
    try {
      const response = await axios.get(
        "https://dvc-ctps.onrender.com/api/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const allUsers = response.data;
      setUsers(allUsers);
      setPendingManagers(
        allUsers.filter(
          (user) => user.role === "manager" && user.status === "Pending"
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveManager = async (id) => {
    try {
      await axios.patch(
        `https://dvc-ctps.onrender.com/api/users/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Approval failed");
    }
  };

  const handleRejectManager = async (id) => {
    try {
      await axios.patch(
        `https://dvc-ctps.onrender.com/api/users/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Rejection failed");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(
        `https://dvc-ctps.onrender.com/api/users/${id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Status update failed");
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(
        `https://dvc-ctps.onrender.com/api/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const getRoleBadge = (role) => {
    if (role === "superadmin")
      return <span className="bdg bdg-superadmin">SUPERADMIN</span>;
    if (role === "manager")
      return <span className="bdg bdg-manager">MANAGER</span>;
    return <span className="bdg bdg-security">SECURITY</span>;
  };

  const getStatusBadge = (status) => {
    if (status === "Active")
      return <span className="bdg bdg-active">ACTIVE</span>;
    if (status === "Pending")
      return <span className="bdg bdg-pending">PENDING</span>;
    if (status === "Rejected")
      return <span className="bdg bdg-rejected">REJECTED</span>;
    return <span className="bdg bdg-inactive">INACTIVE</span>;
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="bc-home">DVC — C.T.P.S. Chandrapura</span>
        <span className="bc-sep"> › </span>
        <span className="bc-cur">Manage Users</span>
      </div>

      {/* Page Title Bar */}
      <div
        className="page-title-bar"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <h2>Manage Users</h2>
          <p>Add, manage and control user access</p>
        </div>
        <div className="page-title-bar-right">{dateTime}</div>
      </div>

      {/* Pending Manager Approvals */}
      <div className="panel" style={{ marginTop: "16px" }}>
        <div className="panel-head">
          <h4>Pending Manager Approvals</h4>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="twrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingManagers.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="no-records">No pending approvals</div>
                    </td>
                  </tr>
                ) : (
                  pendingManagers.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.fullName}</td>
                      <td>{user.username}</td>
                      <td>Manager</td>
                      <td>
                        <span className="bdg bdg-pending">PENDING</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApproveManager(user._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-reject btn-sm"
                            onClick={() => handleRejectManager(user._id)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* All Users Table */}
      <div className="panel" style={{ marginTop: "16px" }}>
        <div className="panel-head">
          <h4>All Users</h4>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="twrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Gate</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      <div className="no-records">No users found</div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.fullName}</td>
                      <td>{user.username}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{user.gate}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleToggleStatus(user._id)}
                          >
                            {user.status === "Active" ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
